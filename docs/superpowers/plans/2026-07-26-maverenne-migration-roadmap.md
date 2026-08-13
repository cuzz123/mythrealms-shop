# Maverenne Migration Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将已批准的 Maverenne 设计拆成三个可独立验收、可回滚的实施阶段，并在最终生产切换前保持 MythRealms 线上版本不变。

**Architecture:** 先在隔离分支建立单一品牌事实源并完成站内改版，再独立迁移 SEO/GEO 与旧神话 URL，最后在所有门槛通过后切换域名和外部平台。每个阶段均须完整通过测试并提交，阶段三以前不得部署到生产。

**Tech Stack:** Next.js 16.2.6 App Router、React 19.2.4、TypeScript 5.9、Node test runner、Playwright 1.61、Vercel、GA4、Google Search Console、Bing Webmaster Tools。

## Global Constraints

- 品牌名固定为 `Maverenne`，建议读法 `MAV-uh-ren`。
- 核心标语固定为 `Come back to yourself.`，品类描述固定为 `Jewelry & Accessories`。
- 目标市场为美国 25–44 岁女性，首阶段价格带为 35–75 美元。
- 不作治疗、好运、能量或保证情绪结果的承诺；不写未经核验的材质、低敏、防水或不褪色承诺。
- 现有商品路径、商品状态、价格、购物车与结账行为不得因改名而变化。
- 不长期运营双品牌；新代码在隔离分支完成，阶段三协调切换前不得发布。
- 旧神话 URL 必须逐页审计，禁止批量删除和全部重定向到首页。
- 旧域名重定向至少保留 12 个月。
- 当前 SEO/GEO P0 在迁移期间保持有效；Pinterest/TikTok 继续由创始人手动发布。
- 域名购买、商标申请、外部平台写入和生产部署分别需要执行时授权。

---

## 执行顺序

1. [阶段一：品牌基础与站内改名](2026-07-26-maverenne-phase-1-brand-foundation.md)
2. [阶段二：SEO/GEO 与旧内容迁移](2026-07-26-maverenne-phase-2-seo-content-migration.md)
3. [阶段三：域名切换与生产验收](2026-07-26-maverenne-phase-3-domain-cutover.md)

每个阶段完成后执行独立代码审查。阶段一与阶段二可以在同一隔离分支顺序完成，但必须保留独立提交；阶段三只能在商标、域名、视觉资产和生产授权四项门槛全部通过后开始。
