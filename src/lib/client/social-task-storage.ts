import { useSyncExternalStore, type Dispatch, type SetStateAction } from "react";

const COMPLETED_KEY = "mythrealms-tasks";
const EXPANDED_KEY = "mythrealms-tasks-expanded";
const CHANGE_EVENT = "mythrealms-social-tasks-change";

type CompletedTasks = Record<string, string>;
type ExpandedCategories = Record<string, boolean>;

const EMPTY_COMPLETED: CompletedTasks = Object.freeze({});
const EMPTY_EXPANDED: ExpandedCategories = Object.freeze({});

let completedRaw: string | null | undefined;
let completedSnapshot = EMPTY_COMPLETED;
let expandedRaw: string | null | undefined;
let expandedSnapshot = EMPTY_EXPANDED;

function parseRecord<T extends string | boolean>(
  raw: string | null,
  isValue: (value: unknown) => value is T,
): Record<string, T> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") return {};
    return Object.values(parsed).every(isValue) ? (parsed as Record<string, T>) : {};
  } catch {
    return {};
  }
}

export function parseCompletedTasks(raw: string | null): CompletedTasks {
  return parseRecord(raw, (value): value is string => typeof value === "string");
}

export function parseExpandedCategories(raw: string | null): ExpandedCategories {
  return parseRecord(raw, (value): value is boolean => typeof value === "boolean");
}

export function writeSocialTaskState(
  storage: Pick<Storage, "setItem">,
  completed: CompletedTasks,
  expanded: ExpandedCategories,
) {
  storage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  storage.setItem(EXPANDED_KEY, JSON.stringify(expanded));
}

function getCompletedSnapshot(): CompletedTasks {
  const raw = window.localStorage.getItem(COMPLETED_KEY);
  if (raw === completedRaw) return completedSnapshot;
  completedRaw = raw;
  completedSnapshot = parseCompletedTasks(raw);
  return completedSnapshot;
}

function getExpandedSnapshot(): ExpandedCategories {
  const raw = window.localStorage.getItem(EXPANDED_KEY);
  if (raw === expandedRaw) return expandedSnapshot;
  expandedRaw = raw;
  expandedSnapshot = parseExpandedCategories(raw);
  return expandedSnapshot;
}

function subscribe(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === COMPLETED_KEY || event.key === EXPANDED_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function resolveAction<T>(action: SetStateAction<T>, current: T): T {
  return typeof action === "function" ? (action as (value: T) => T)(current) : action;
}

export function useSocialTaskStorage(): {
  completed: CompletedTasks;
  expanded: ExpandedCategories;
  setCompleted: Dispatch<SetStateAction<CompletedTasks>>;
  setExpanded: Dispatch<SetStateAction<ExpandedCategories>>;
} {
  const completed = useSyncExternalStore(subscribe, getCompletedSnapshot, () => EMPTY_COMPLETED);
  const expanded = useSyncExternalStore(subscribe, getExpandedSnapshot, () => EMPTY_EXPANDED);

  const setCompleted: Dispatch<SetStateAction<CompletedTasks>> = (action) => {
    writeSocialTaskState(window.localStorage, resolveAction(action, completed), expanded);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };
  const setExpanded: Dispatch<SetStateAction<ExpandedCategories>> = (action) => {
    writeSocialTaskState(window.localStorage, completed, resolveAction(action, expanded));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return { completed, expanded, setCompleted, setExpanded };
}
