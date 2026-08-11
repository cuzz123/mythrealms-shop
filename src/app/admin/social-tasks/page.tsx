"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from "lucide-react";
import { PinterestDraftQueue } from "@/components/admin/PinterestDraftQueue";

// ====== TASK DEFINITIONS ======
interface Task {
  id: string; label: string; detail: string; freq: "daily" | "weekly" | "monthly";
  guideStatus?: "archived";
}

interface Category {
  icon: string; name: string; tasks: Task[];
}

const CATEGORIES: Category[] = [
  {
    icon: "\u{1F4CC}", name: "Pinterest",
    tasks: [
      { id: "pin-browse", label: "浏览首页推荐 3 分钟", detail: "模拟真实用户行为", freq: "daily", guideStatus: "archived" },
      { id: "pin-save", label: "搜索 + 保存 5-8 条 Pin", detail: "搜 gold jewelry / mythology art / crystal bracelet", freq: "daily", guideStatus: "archived" },
      { id: "pin-like", label: "点赞 3-5 条 + 关注 2-3 个账号", detail: "点心形图标，关注同品类账号", freq: "daily", guideStatus: "archived" },
      { id: "pin-post", label: "Internal candidate review（NO-GO）", detail: "仅审校唯一产品候选；submitted = 0，published = 0", freq: "daily", guideStatus: "archived" },
      { id: "pin-vertical", label: "Canva 做 2 张竖版 2:3 图", detail: "1000x1500，产品图 + 文字，品牌色 #0F0D0E", freq: "weekly", guideStatus: "archived" },
      { id: "pin-analytics", label: "查看企业分析", detail: "本周展示次数和点击最多的 3 条 Pin", freq: "weekly", guideStatus: "archived" },
    ],
  },
  {
    icon: "\u{1F4F1}", name: "TikTok",
    tasks: [
      { id: "tt-browse", label: "浏览 For You 15 分钟", detail: "正常刷视频，完播/点赞/收藏", freq: "daily", guideStatus: "archived" },
      { id: "tt-check-ip", label: "检查 IP 稳定性", detail: "whatismyipaddress.com 确认 IP 没变", freq: "daily", guideStatus: "archived" },
      { id: "tt-post", label: "发布视频 (每周 3-4 条)", detail: "用 tiktok-30day-calendar-zh.md 脚本", freq: "weekly", guideStatus: "archived" },
    ],
  },
  {
    icon: "\u{1F50D}", name: "SEO",
    tasks: [
      { id: "seo-console", label: "查看 Search Console", detail: "展示次数/点击率变化，新搜索词", freq: "daily", guideStatus: "archived" },
      { id: "seo-gmc", label: "检查 GMC 审核状态", detail: "Google Merchant Center → 产品 → 未核准数量", freq: "daily", guideStatus: "archived" },
      { id: "seo-blog", label: "发布 1 篇新博客", detail: "长尾关键词 + 答案胶囊, 300-500 字", freq: "weekly", guideStatus: "archived" },
    ],
  },
  {
    icon: "\u{1F916}", name: "GEO",
    tasks: [
      { id: "geo-test", label: "测试 AI 引用", detail: "ChatGPT 搜 mythical jewelry chinese mythology", freq: "weekly", guideStatus: "archived" },
      { id: "geo-reddit", label: "Reddit/Quora 回答 1 个问题", detail: "搜 mythology jewelry，回答并附链接", freq: "weekly", guideStatus: "archived" },
    ],
  },
  {
    icon: "\u{1F4E7}", name: "Email",
    tasks: [
      { id: "email-newsletter", label: "检查 Newsletter 订阅数", detail: "看新增订阅，如果本周超过 10 人考虑发第一期", freq: "weekly" },
      { id: "email-check", label: "检查弃单邮件发送情况", detail: "Resend Dashboard → 查看发送成功率和打开率", freq: "weekly" },
    ],
  },
  {
    icon: "\u{1F4CA}", name: "Analytics",
    tasks: [
      { id: "ga-realtime", label: "查看 GA4 实时", detail: "看当前在线人数、页面浏览", freq: "daily" },
      { id: "ga-weekly", label: "查看 GA4 周报", detail: "流量获取 → 看来源渠道分布。互动 → 事件 → view_item / add_to_cart / purchase", freq: "weekly" },
      { id: "pixel-test", label: "测试 Meta Pixel", detail: "Meta Events Manager → Test Events → 确认 purchase 事件正常发送", freq: "weekly" },
    ],
  },
  {
    icon: "\u{1F4E6}", name: "Operations",
    tasks: [
      { id: "ops-orders", label: "检查新订单", detail: "Admin → Orders → PAID → SHIPPED", freq: "daily", guideStatus: "archived" },
      { id: "ops-emails", label: "回复客户邮件", detail: "使用联系表单处理新消息", freq: "daily", guideStatus: "archived" },
      { id: "ops-stock", label: "检查低库存产品", detail: "库存 < 5 的产品决定是否补货", freq: "weekly", guideStatus: "archived" },
    ],
  },
  {
    icon: "\u{1F4DD}", name: "Content",
    tasks: [
      { id: "content-blog", label: "博客选题研究", detail: "Pinterest/Google 搜索相关关键词，记录 3 个下周要写的选题", freq: "weekly" },
      { id: "content-images", label: "整理本周生成的图片", detail: "新生成的图是否已部署到网站和 Pinterest", freq: "weekly" },
    ],
  },
];

// ====== COMPONENT ======
export default function SocialTasksPage() {
  const [completed, setCompleted] = useState<Record<string, string>>({}); // taskId -> date
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mythrealms-tasks");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time compatibility hydration from the established admin key.
    if (saved) setCompleted(JSON.parse(saved));
    const exp = localStorage.getItem("mythrealms-tasks-expanded");
    if (exp) setExpanded(JSON.parse(exp));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("mythrealms-tasks", JSON.stringify(completed));
    localStorage.setItem("mythrealms-tasks-expanded", JSON.stringify(expanded));
  }, [completed, expanded]);

  const today = new Date().toISOString().slice(0, 10);
  const isToday = (date: string) => date === today;

  function toggleTask(taskId: string) {
    setCompleted((prev) => {
      if (prev[taskId] && isToday(prev[taskId])) {
        const next = { ...prev };
        delete next[taskId];
        return next;
      }
      return { ...prev, [taskId]: today };
    });
  }

  function toggleCategory(name: string) {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function getCompletedToday(category: Category): number {
    return category.tasks.filter((t) => completed[t.id] && isToday(completed[t.id])).length;
  }

  function getAllCompletedToday(): number {
    let count = 0;
    CATEGORIES.forEach((c) => { count += getCompletedToday(c); });
    return count;
  }

  function getTotalDailyTasks(): number {
    let count = 0;
    CATEGORIES.forEach((c) => {
      count += c.tasks.filter((t) => t.freq === "daily").length;
    });
    return count;
  }

  const todayDone = getAllCompletedToday();
  const todayTotal = getTotalDailyTasks();
  const progressPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-[var(--text)]">Operations Dashboard</h1>
        <span className="text-sm text-[var(--text-muted)]">{today}</span>
      </div>

      <PinterestDraftQueue />

      {/* Progress bar */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[var(--text)]">Today Progress</span>
          <span className="text-sm text-[var(--text-muted)]">{todayDone}/{todayTotal} tasks ({progressPct}%)</span>
        </div>
        <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {CATEGORIES.map((cat) => {
          const catDone = getCompletedToday(cat);
          const catTotal = cat.tasks.filter((t) => t.freq === "daily").length;
          const isExpanded = expanded[cat.name] !== false; // default open

          return (
            <div key={cat.name} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(cat.name)}
                className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg)] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-semibold text-[var(--text)]">{cat.name}</span>
                  {catDone === catTotal && catTotal > 0 && (
                    <span className="px-2 py-0.5 bg-[var(--success)]/10 text-[var(--success)] text-[10px] font-semibold rounded-full">
                      Complete
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">{catDone}/{cat.tasks.length}</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[var(--border)]">
                  {cat.tasks.map((task) => {
                    const done = completed[task.id] && isToday(completed[task.id]);
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`w-full flex items-start gap-3 p-3 pl-4 hover:bg-[var(--bg)] transition text-left border-b border-[var(--border)] last:border-b-0 ${
                          done ? "opacity-60" : ""
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className={`text-sm ${done ? "line-through text-[var(--text-muted)]" : "text-[var(--text)]"}`}>
                            {task.label}
                          </span>
                          <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                            {task.freq === "daily" ? "每日" : task.freq === "weekly" ? "每周" : "每月"}
                            {" · "}{task.detail}
                            {task.guideStatus === "archived" && (
                              <>{" · "}<span>操作指南已归档，等待审核后的替代版本。</span></>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset button */}
      <div className="text-center mt-8 pb-12">
        <button
          onClick={() => {
            if (confirm("Reset all completed tasks?")) {
              setCompleted({});
            }
          }}
          className="text-xs text-[var(--text-muted)] underline hover:text-[var(--text)]"
        >
          Reset All Tasks
        </button>
      </div>
    </div>
  );
}
