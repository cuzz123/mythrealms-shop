# MythRealms 变现关键路径设计

## 背景

当前工作区已经完成一轮 storefront release hardening：服务端权威报价、PayPal 订单绑定、支付金额校验、幂等履约与后台鉴权都有测试覆盖。本地单测、类型检查和生产构建可以通过。

仍然阻止真实成交的不是基础代码可运行性，而是以下上线缺口：生产站点仍是旧目录；Lemon Squeezy 既处于测试模式又不支持实体珠宝；PayPal webhook 配置与账户不一致；生产数据库缺少履约代码所依赖的列；订单后台不能可靠显示静态目录商品；后台“退款”只修改本地状态；订单邮件仍使用 Resend 测试发件域名。

本设计把“快速变现”拆成三个独立子项目，并只设计第一个：

1. **首单闭环（本设计）**：PayPal-only、数据库兼容、订单后台、品牌邮件、退款安全、上线前检查。
2. **商品与毛利**：选择 3–5 个主推 SKU，补供应商、成本、材质、尺寸、干净图片和统一政策。
3. **增长与归因**：埋点、UTM、Newsletter、弃购恢复和小额流量测试。

三个子项目按顺序执行；首单闭环未通过前不实施付费投流。

## 目标

把当前珍珠站收敛为一个可受控发布的 PayPal-only 商店，并证明以下闭环可以完成：

`权威报价 → PENDING 订单 → PayPal 扣款 → PAID → 后台准确显示 → 品牌邮件 → PayPal 退款 → REFUNDED`

“证明闭环”分为两层：

- 自动化层：测试覆盖所有本地状态和错误边界。
- 生产层：代码发布、PayPal live 配置修改和真实小额支付/退款必须在用户明确授权后单独执行。

## 方案选择

### 方案 A：一次性完成支付、商品、CRM 和增长系统

优点是最终形态完整。缺点是改动面过大，当前工作区已有大量未提交改动，无法快速建立可发布基线，也难以定位首单失败点。本轮不采用。

### 方案 B：PayPal-only 人工履约 MVP（采用）

先停用不适合实体商品的 Lemon Squeezy/Card 入口，保留已有的服务端权威报价和 PayPal 安全绑定；通过最小的数据库前向变更、后台快照回退、品牌邮件配置和只读上线检查打通一条真实订单路径。退款先在 PayPal 发起，再由已验证 webhook 同步本地状态。

该方案牺牲短期支付方式丰富度，换取最小改动面、最低资金风险和最快的可验证成交。

### 方案 C：用 PayPal payment link 或私信人工收款

上线最快，但订单金额、地址、商品和付款无法自动绑定，容易造成错单、漏单和退款争议，只能作为网站完全不可用时的临时兜底，不作为实现目标。

## 范围

### 本轮包含

- 结账页只展示 PayPal，不再把 Lemon Squeezy 描述为 Card、Afterpay 或 Klarna。
- Lemon Squeezy checkout 创建接口失败关闭，不再为新订单创建测试 checkout；已有 webhook 代码保留但不作为公开支付能力。
- 保留当前服务端权威报价、PayPal `custom_id`、金额/币种/provider order ID 校验和幂等履约。
- 增加数据库 launch preflight，验证付款闭环依赖的表和列存在。
- 提供幂等、前向兼容的付款关键列 SQL；不在 Vercel build 阶段自动改生产数据库。
- 后台订单详情优先使用关联商品，关联为空时使用 `productSnapshot`；地址兼容当前存储的 `address` 字段。
- 禁止后台通过普通状态 PATCH 把已付款订单直接标记为 `REFUNDED`；退款必须先在 PayPal 发起，再由 webhook 同步。
- 订单邮件必须使用显式 `RESEND_FROM_EMAIL`；生产环境缺失时明确报告“付款成功但邮件待处理”，不能伪装发送成功。
- 增加只读 launch readiness 命令，检查必需环境变量、数据库列、PayPal webhook URL/ID/事件订阅和 Resend 发件人配置。
- 修复首单路径上的购物车优惠码契约，使预览与结账共用同一服务端报价输入。
- 增加一份生产发布与回滚 runbook。

### 本轮不包含

- 修改 PayPal live webhook、创建真实订单、扣款或退款；这些是后续显式授权的生产操作。
- 接入新的银行卡收单服务。
- 自动退款、自动取消、自动修改地址。
- 45 个静态商品全量迁移到 Prisma。
- 3–5 个主推 SKU 的选择、成本核算和图片重拍。
- GA4/Meta/Pinterest 埋点、Newsletter 和弃购营销。
- 3D、视频、SEO、博客或运营中心新功能。

## 工作区策略

当前珍珠站改版和支付加固都存在于未提交工作区，基于旧 `HEAD` 创建 worktree 会丢失本设计依赖的实现。因此本轮继续在当前工作区增量修改，只触碰设计列出的文件，并在每个任务前后记录窄范围 diff；不回退、不格式化、不提交任何无关改动。

设计文档可以单独提交。实现阶段的提交必须按任务显式列出文件，避免混入用户现有修改。

## 架构与数据流

### 1. PayPal-only 客户路径

结账页直接呈现 PayPal 按钮。浏览器只提交商品 ID、可选 variant ID、数量、邮箱和地址。服务端重新解析输入并生成权威报价，再创建 `PENDING` 订单和 PayPal order。

PayPal capture 返回后，服务端必须核对：

- provider order ID 等于数据库保存值；
- `custom_id` 等于数据库订单 ID；
- capture 状态为 `COMPLETED`；
- 币种为 `USD`；
- 金额精确等于数据库订单总额。

全部匹配后才调用现有 `fulfillPaidOrder()`。任何不匹配都返回冲突错误并保持本地订单未支付。

### 2. 数据库发布门槛

付款闭环依赖 `Order.confirmationClaimedAt` 和 `Order.confirmationSentAt`。仓库增加两部分：

- 一个幂等 SQL 文件，只为缺失列执行 `ADD COLUMN IF NOT EXISTS`；
- 一个只读 preflight，通过 `information_schema` 检查生产库，不依赖 Prisma 对缺失列的模型选择。

SQL 必须由操作者在部署前显式执行。构建命令保持只生成 Prisma Client 和构建应用，避免每次 Vercel build 都修改数据库。

如果 preflight 未通过，runbook 要求停止部署；不能通过捕获 P2022 后继续收款。

### 3. 订单后台适配

静态目录订单不会写入 Prisma 商品外键，`OrderItem.product` 为 `null` 是合法状态。增加一个纯函数，把订单项解析为后台展示模型：

- 有关联商品时使用关联商品名称、slug 和图片；
- 无关联商品时解析 `productSnapshot`；
- 快照损坏时使用稳定的“Unknown item”回退，不让页面崩溃；
- 没有 slug 时不渲染错误商品链接。

地址展示同时接受 `address` 和遗留 `line1`，其余城市、州、省邮编和国家字段保持原样。

### 4. 退款边界

普通后台状态更新只管理履约状态，不能代表资金动作：

- `PENDING` 可以取消；
- `PAID`、`SHIPPED`、`DELIVERED` 不能通过 PATCH 直接变为 `REFUNDED`；
- 管理页面显示“在 PayPal 发起退款”的说明，不发送虚假的本地退款请求；
- PayPal `PAYMENT.CAPTURE.REFUNDED` webhook 验证累计退款金额，只有全额退款才把订单设为 `REFUNDED`；部分退款只更新 provider payment status。

这一边界防止出现“后台显示已退款，但客户未收到钱”。

### 5. 邮件边界

邮件模块从 `RESEND_FROM_EMAIL` 读取完整发件人，例如 `MythRealms <orders@已验证域名>`。不再使用 `onboarding@resend.dev` 默认值。

- 缺少 `RESEND_API_KEY` 或 `RESEND_FROM_EMAIL` 时抛出明确配置错误；
- 已确认付款不会因邮件失败而回滚；
- durable claim 会释放，让后台或后续任务可以重试；
- readiness 命令只检查配置，不发送测试邮件。

### 6. 上线检查

`npm run launch:check` 只读执行并返回非零退出码，覆盖：

- 必需的 PayPal live 基础 URL、client ID、secret 和 webhook ID；
- PayPal webhook ID 确实存在，URL 等于当前公开 webhook URL；
- webhook 至少订阅 `PAYMENT.CAPTURE.COMPLETED` 和 `PAYMENT.CAPTURE.REFUNDED`；
- 数据库可连接且付款关键列存在；
- `RESEND_API_KEY` 和 `RESEND_FROM_EMAIL` 已配置；
- `NEXT_PUBLIC_APP_URL` 为 HTTPS 自定义域名或明确批准的临时域名。

检查器必须屏蔽 secret，只输出缺失项、错误项和可执行的修复提示。它不创建、不更新任何第三方资源。

## 错误处理

- 无效结账输入返回 400。
- 支付绑定或金额不一致返回 409，订单保持未支付。
- PayPal/Resend 配置缺失返回 503；第三方网络或 API 失败返回 502。
- 数据库 preflight 失败使发布检查退出 1，但不修改数据库。
- 已完成付款但邮件失败时，成功页继续显示已支付，同时明确后台存在待重试邮件状态。
- 快照或地址 JSON 损坏只降级后台展示，不影响订单读取。
- webhook ID、URL或订阅不匹配只报告，不自动修改 live 配置。

## 测试策略

所有生产行为采用测试先行：先新增一个能复现缺口的失败测试，确认失败原因正确，再写最小实现。

单元/静态测试覆盖：

- 结账 UI 和公开 checkout 路径不再提供 Lemon Squeezy/Card。
- PayPal 创建、capture 和 webhook 仍使用权威报价与订单绑定。
- 数据库 schema preflight 在列缺失/存在时分别失败/通过。
- 订单项有关系、只有快照、损坏快照三种展示结果。
- 地址 `address`/`line1` 兼容。
- 后台拒绝直接 `REFUNDED`，PayPal webhook 仍可同步全额退款。
- 邮件缺少显式发件人时失败，配置完整时把发件人传给 Resend。
- launch checker 对 webhook ID、URL、事件、数据库列和邮件配置逐项失败关闭，并且不泄露 secret。
- 购物车优惠码与 checkout 共用相同请求形状和报价结果。

发布验证覆盖：

- 全量单元测试；
- TypeScript；
- Prisma validate；
- 生产构建；
- PayPal-only Playwright 核心路径；
- launch readiness（先对测试替身，再在获得授权后对生产只读运行）。

## 发布与回滚

发布按以下顺序执行：

1. 备份生产数据库并记录当前部署 ID。
2. 对目标数据库运行只读 preflight，预期先因缺列失败。
3. 人工执行幂等 SQL，再次运行 preflight。
4. 配置经过验证的 Resend 发件人。
5. 在用户明确授权后修正 PayPal live webhook ID/URL/事件。
6. 运行完整验证并部署候选版本。
7. 先做不扣款的页面/API smoke test。
8. 在用户再次确认后做一笔真实小额支付和全额退款。

如果支付前 smoke test 失败，回滚部署；如果支付已成功但应用回写失败，禁止重复扣款，先从 PayPal 查询 provider order 并人工对账。数据库迁移只增加可空列，回滚应用时不需要删除列。

## 验收标准

- 顾客在任何公开结账界面都不会看到或调用 Lemon Squeezy、Afterpay、Klarna 或虚假的 Card 能力。
- 任意客户端篡改价格、订单 ID、PayPal order ID、金额或币种都不能改变应收金额或付款归属。
- 生产数据库缺少付款关键列时，发布检查明确失败，应用不会被宣称可收款。
- 静态商品订单可以在后台查看准确名称、图片、数量、单价和地址，不依赖 Prisma 商品外键。
- 后台无法只改状态就声称完成退款；PayPal 全额退款 webhook 能同步 `REFUNDED`。
- 没有经过验证的 Resend 发件人时不会伪装成已发邮件。
- 所有自动化验证通过后，仍需用户单独授权生产 webhook 修改和真实资金测试。
