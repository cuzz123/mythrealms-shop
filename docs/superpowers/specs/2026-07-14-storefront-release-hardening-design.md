# MythRealms 发布加固设计

## 目标

把当前 MythRealms 独立站收敛为仅销售 20 个珍珠 SKU 的可发布商店，修复真实收款、订单状态、后台权限、商品可见性、移动端导航和 SEO/GEO 的发布阻断问题，同时保留现有珍珠产品资产与内容生产管线。

## 范围

本轮包含：

- 20 个 `pearl-series` 商品成为唯一公开和可结账目录。
- 信用卡与 PayPal 使用同一套服务端报价、折扣与地址校验。
- 支付完成后的订单、积分、库存、优惠码和邮件处理具备幂等性。
- 后台、AI Studio、自动化及 Pinterest 凭证接口使用服务端权限校验。
- 礼品卡暂时下线；旧商品、旧推荐和水晶主题内容退出公开入口。
- 修复移动端 Header、分类筛选、弹窗可访问性和商品可信度问题。
- 统一珍珠品牌的 canonical、Open Graph、feed、robots、llms.txt 与 sitemap 信号。

本轮不包含：

- 完整礼品卡支付、余额和兑换系统。
- 将 20 个静态珍珠 SKU 全量迁移进 Prisma 商品表。
- 重写全部珍珠博客文章。
- 更换已经通过来源路径校验的供应商商品图。
- Vercel 生产部署。

## 方案选择

采用混合发布加固方案：静态珍珠目录负责公开商品事实，Prisma 继续负责订单、用户、折扣与运营数据。相比立刻迁移全部商品进数据库，该方案能保留当前产品资产和页面结构，并以较小风险建立可靠的交易边界。

当前工作区包含大量尚未提交的珍珠站改版，因此实施在当前工作区增量完成，不创建基于旧 HEAD 的隔离 worktree。所有修改限定在规格涉及的文件，禁止回退已有产品资产和无关改动。

## 架构

### 1. 公开商品目录

新增服务端与客户端都可复用的 storefront catalog 模块，提供以下稳定接口：

- `getStorefrontProducts()`：仅返回激活、在售的 20 个珍珠商品。
- `getStorefrontProductById(id)`：按静态商品 ID 获取可售商品。
- `getStorefrontProductBySlug(slug)`：按 slug 获取可售商品。
- `isCustomerVisibleProduct(product)`：统一判断公开可见性。
- `getProductType(product)`：返回 `earrings`、`bracelets`、`necklaces`、`hair-accessories`、`eyewear-chains` 或 `rings`。

所有公开页面、搜索、Quiz、Wishlist、Recently Viewed、TikTok、feed 和 sitemap 必须通过该模块取数。数据库 Product 不再进入公开商店路由；不在白名单内的商品 URL 使用 Next.js `notFound()` 返回真实 404。

旧商品定义可暂时保留在源文件中供资产追溯，但不得进入客户端搜索结果、推荐、JSON-LD、feed 或公开 API。

### 2. 服务端报价

新增纯函数报价模块，以整数美分处理金额：

- 输入只接受 `productId`、可选 `variantId`、`quantity` 和优惠码字符串。
- 数量必须是 1 到 10 的整数；每笔订单最多 20 行、总数量最多 50。
- 静态商品价格只从 storefront catalog 读取，忽略浏览器提交的名称和价格。
- 运费规则保持 `$69.99` 及以上免邮，否则 `$4.99`。
- 折扣码从数据库重新加载并验证启用时间、过期时间、次数、最低金额和首单条件。
- 客户端折扣金额、subtotal 和 total 永不作为订单事实使用。

信用卡、PayPal 和折扣预览接口调用同一报价服务，返回相同的 subtotal、shipping、discount 和 total。

### 3. 结账与支付绑定

结账请求必须包含合法邮箱和完整收货地址。客户端先做即时提示，服务端重复执行同一字段规则。

信用卡流程：

1. 服务端生成权威报价。
2. 创建 `PENDING` 订单与权威 OrderItem 快照。
3. 创建 LemonSqueezy checkout，并将 provider checkout ID 保存到订单的唯一 provider 字段。
4. 浏览器跳转前不清空购物车。
5. 只有经签名 webhook 确认付款后，订单才进入 `PAID`。

PayPal 流程：

1. 通过同一服务端报价创建 `PENDING` 订单。
2. 创建 PayPal order，将数据库订单 ID 写入 PayPal `custom_id`，并保存 PayPal order ID。
3. capture 接口只按已保存的 PayPal order ID 读取数据库订单；客户端提交的数据库订单 ID 只能用于一致性检查，不能决定更新目标。
4. capture 响应必须核对 `COMPLETED`、`custom_id`、`USD` 和精确总金额。
5. 任一字段不匹配均返回错误且不改变订单状态。

### 4. 幂等履约

集中实现 `fulfillPaidOrder()`：

- 使用条件更新原子争抢 `PENDING -> PAID`，只有成功更新一行的调用者继续副作用。
- capture 与两个 webhook 共用该函数。
- 静态珍珠商品当前不操作 Variant 库存；存在数据库 variant 的订单才执行带库存下限的更新。
- 积分只在付款成功后写入，并通过订单 ID 防止重复奖励。
- 优惠码使用次数只在付款成功后增加一次。
- 确认邮件只由赢得状态转换的调用者发送一次。
- 已是 `PAID` 的重复事件返回幂等成功，不重复副作用。

为避免高风险数据库迁移，本轮复用现有唯一 `stripeSessionId` 作为 provider order ID，并用 `stripePaymentStatus` 记录 provider 与状态。后续数据库重构可再改为中性的 payment 字段。

### 5. 权限与公开接口

- Admin layout 改为服务端组件，在渲染任何子页面前调用 `auth()` 并验证 `ADMIN`。
- 所有 `/api/admin/*` 使用统一 `requireAdmin()`。
- AI Studio 图片/视频生成与上传接口只允许管理员。
- 自动化接口只接受管理员会话或签名 cron secret，按用途二选一。
- 删除或令 `/api/debug/discounts` 返回 404。
- Pinterest token 与 callback 必须管理员登录，并使用短期、服务端校验的 OAuth state；token 不回显到页面。
- 缺少生产密钥时接口失败关闭，不返回伪成功。

### 6. 功能与可信度

- `/gift-cards` 使用 `notFound()`，并移除 Header、Footer 和其他页面入口。
- Contact 与 Returns 只有在邮件服务明确返回成功时展示确认；未配置或 provider 非 2xx 时返回可恢复错误。
- Checkout success 仅对真实存在且状态为 `PAID` 的订单显示确认；`PENDING` 显示处理中，未知订单返回 404。
- 删除随机实时浏览人数、无来源的评分/评价数量及对应 `aggregateRating`。
- 在未实际接入前移除 Afterpay 与 Klarna 文案和徽标。
- 首页 SKU 命名图片必须与实际产品一致；无法保证时使用非 SKU 特定的 editorial 文案。
- 静态商品评价提交入口暂时隐藏，直到评价模型支持静态 SKU。

### 7. UI/UX

- Announcement Bar 保持正常文档流，不覆盖 Header。
- 移动端 Header 只保留必要操作，保证 320px 到 430px 视口无横向滚动；菜单按钮完整可见。
- `allowedDevOrigins` 明确允许 `localhost` 和 `127.0.0.1`，保证本地两种地址都可 hydration。
- Shop 子菜单使用真实 `type` 查询参数，集合页按商品类型过滤；不再用多个标签指向同一无筛选结果。
- Cart、Search 和移动菜单关闭时从可访问树移除；打开后设置初始焦点、Escape、焦点约束与焦点恢复。
- 商品图库箭头和缩略图提供明确的 `aria-label` 与当前图片状态。
- Footer 永久展示 Privacy、Terms、Shipping、Refund 和 FAQ。

### 8. SEO/GEO

- 根 layout 不再给所有路由继承首页 canonical；首页和公开索引页分别提供 self-canonical。
- Open Graph 图片和文案统一为 pearl jewelry，不再出现 crystal wellness、stones 或旧集合名。
- `/api/feed` 成为唯一珍珠商品 feed，使用 20 SKU；旧 Google feed 重定向或复用同一数据源。
- `llms.txt` 指向权威珍珠 feed；robots 仅允许必要的公开 feed，继续禁止其他 API。
- 旧水晶博客暂时 `noindex`，从 sitemap、GEO feed 和主导航移除，内容重写后再恢复索引。
- sitemap 的 20 个静态商品 URL 不依赖数据库；博客数据库失败不得影响商品 sitemap。
- 产品标题、alt、breadcrumb、JSON-LD 与集合名统一为 `The Pearl Edit` 和 pearl jewelry。

## 错误处理

- 输入错误返回 400，并提供稳定、可展示的英文错误信息。
- 未认证返回 401，非管理员返回 403，不存在或已下线资源返回 404。
- provider 配置缺失返回 503；provider 请求失败返回 502。
- 支付金额或订单绑定不一致返回 409，并记录不含密钥和个人地址的结构化日志。
- 邮件失败不回滚已确认支付，但记录待人工处理；联系和退货邮件失败则不显示提交成功。
- 数据库不可用时结账失败关闭，静态目录页面仍能正常渲染。

## 测试策略

采用测试先行：每项生产行为先写失败测试，再实现最小修复。

单元测试覆盖：

- 20 SKU 白名单、旧产品不可见、商品类型分类。
- 忽略客户端价格、数量边界、整数美分、运费和折扣计算。
- 无效地址、邮箱、优惠码与首单限制。
- PayPal ID、`custom_id`、金额和币种绑定。
- `PENDING -> PAID` 幂等状态转换和重复 webhook。
- Admin/cron 权限判断。

Playwright 覆盖：

- 320px、390px 和桌面导航无横向溢出。
- Shop 类型筛选得到对应产品。
- 搜索和 Quiz 不出现旧商品。
- 购物车在支付跳转和取消前仍保留。
- 未知订单不显示成功，PENDING 与 PAID 状态文案正确。
- 键盘可打开、操作并关闭 Cart、Search 与移动菜单。

发布验证包括 TypeScript、Prisma validate、ESLint、单元测试、Playwright 核心流程、20 SKU 来源校验和 production build。构建时数据库不可用造成的 sitemap 静默缺失必须消除。

## 验收标准

- 任意篡改前端价格、折扣、数量或订单 ID 都不能改变服务端应收金额或付款归属。
- 20 个珍珠 SKU 之外的商品不出现在任何公开页面、搜索、API、feed、sitemap 或 JSON-LD。
- 重复 capture/webhook 不重复发积分、扣库存、增优惠码次数或发邮件。
- 未登录用户无法从 HTML/RSC 或 API 获得后台数据，也无法调用付费生成接口。
- 320px 至 1440px 视口无全页横向滚动，所有主导航与结账控件可键盘操作。
- 公开 SEO/GEO 信号只描述珍珠首饰和 `The Pearl Edit`。
- 礼品卡、旧水晶博客和无法兑现的支付/评价承诺不再公开。
