
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import {
  IconCheck,
  IconTrash,
} from "@/components/Icons";

import { useToast } from "@/components/ToastMessage"

interface CheckItem {
  id: number;
  text: string;
  checked: boolean;
  category: string;
}


type SvgProps = {
  children: ReactNode;
  className?: string;
  strokeWidth?: number;
};

const Svg = ({
  children,
  className = "h-4 w-4",
  strokeWidth = 2,
}: SvgProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

type CatSvgProps = {
  children: ReactNode;
  className?: string;
};

const CatSvg = ({
  children,
  className = "h-5 w-5",
}: CatSvgProps) => (
  <Svg className={className}>
    {children}
  </Svg>
);

type IconProps = {
  className?: string;
};

type Category = {
  key: string;
  label: string;
  c: string;
  cb: string;
  icon: (props: IconProps) => ReactNode;
};

export const CATEGORIES: Category[] = [
  {
    key: "docs",
    label: "Documents",
    c: "#2F5BD3",
    cb: "#E8EEFC",
    icon: (p) => (
      <CatSvg {...p}>
        <rect
          x="5"
          y="3"
          width="14"
          height="18"
          rx="2"
        />
        <circle cx="12" cy="10" r="3" />
        <path d="M9 16h6" />
      </CatSvg>
    ),
  },
  {
    key: "money",
    label: "Money",
    c: "#13795B",
    cb: "#E2F3EB",
    icon: (p) => (
      <CatSvg {...p}>
        <rect
          x="3"
          y="6"
          width="18"
          height="13"
          rx="2"
        />
        <path d="M3 10h18" />
        <circle cx="16" cy="14.5" r="1.3" />
      </CatSvg>
    ),
  },
  {
    key: "clothing",
    label: "Clothing",
    c: "#8A3FB8",
    cb: "#F3EAFA",
    icon: (p) => (
      <CatSvg {...p}>
        <path d="M8 3l4 3 4-3 4 3-2 4h-2v11H8V10H6L4 6z" />
      </CatSvg>
    ),
  },
  {
    key: "health",
    label: "Health",
    c: "#C2255C",
    cb: "#FCE8EF",
    icon: (p) => (
      <CatSvg {...p}>
        <rect
          x="4"
          y="7"
          width="16"
          height="13"
          rx="2"
        />
        <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        <path d="M12 10.5v6M9 13.5h6" />
      </CatSvg>
    ),
  },
  {
    key: "food",
    label: "Food",
    c: "#C0501A",
    cb: "#FCEBE1",
    icon: (p) => (
      <CatSvg {...p}>
        <path d="M12 7c-3-3-8-1-8 4 0 4 4 9 8 9s8-5 8-9c0-5-5-7-8-4z" />
        <path d="M12 7c0-2 1-4 3-4" />
      </CatSvg>
    ),
  },
  {
    key: "act",
    label: "Activities",
    c: "#0E6E66",
    cb: "#E3F2EF",
    icon: (p) => (
      <CatSvg {...p}>
        <path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
        <path
          d="M13 6v12"
          strokeDasharray="2 2"
        />
      </CatSvg>
    ),
  },
];

type InlineFormProps = {
  initial?: string;
  placeholder?: string;
  label: string;
  keepOpen?: boolean;
  onSave: (value: string) => void;
  onCancel: () => void;
  className?: string;
  children?: ReactNode;
};

const inputCls =
  "min-w-0 flex-1 rounded-[10px] border border-[#B8C1CE] bg-white px-3 py-2 text-[15px] text-[#111827] outline-none focus:border-[#0E6E66] focus:ring-2 focus:ring-[#0E6E66]/15";

const saveCls =
  "min-h-10 rounded-[10px] px-3.5 text-[14px] font-bold text-white bg-[#111827] hover:bg-black";

const cancelCls =
  "min-h-10 rounded-[10px] px-3 text-[14px] font-bold text-[#4A5568] hover:bg-white";

function InlineForm({
  initial = "",
  placeholder,
  label,
  keepOpen = false,
  onSave,
  onCancel,
  className = "",
  children,
}: InlineFormProps) {
  const [value, setValue] = useState(initial);

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    ref.current?.focus();

    if (initial) {
      ref.current?.select();
    }
  }, [initial]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = value.trim();

    if (!trimmed) {
      ref.current?.focus();
      return;
    }

    onSave(trimmed);

    if (keepOpen) {
      setValue("");
      ref.current?.focus();
    }
  };

  return (
    <form
      onSubmit={submit}
      className={`flex items-center gap-1.5 ${className}`}
    >
      {children}

      <input
        ref={ref}
        aria-label={label}
        className={inputCls}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onCancel();
          }
        }}
      />

      <button
        type="submit"
        className={saveCls}
      >
        Save
      </button>

      <button
        type="button"
        className={cancelCls}
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
}

type ItemRowProps = {
  item: CheckItem;
  color: string;
  editing: boolean;
  onToggle: () => void;
  onStartEdit: () => void;
  onSaveEdit: (text: string) => void;
  onCancelEdit: () => void;
  onDelete: () => void;
};

function ItemRow({
  item,
  color,
  editing,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: ItemRowProps) {
  if (editing) {
    return (
      <li className="flex min-h-[52px] items-center border-b border-[#E1E5EC] py-1.5 last:border-b-0">
        <InlineForm
          initial={item.text}
          label="Edit item"
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          className="w-full"
        />
      </li>
    );
  }

  return (
    <li className="group flex min-h-[52px] items-center gap-3 border-b border-[#E1E5EC] py-1.5 last:border-b-0">
      <label className="relative grid h-7 w-7 shrink-0 cursor-pointer place-items-center">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={onToggle}
          aria-label={item.text}
          className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
        />

        <span
          style={
            {
              "--c": color,
            } as React.CSSProperties
          }
          className="grid h-6 w-6 place-items-center rounded-lg border-2 border-[#B8C1CE] bg-white text-transparent transition group-hover:border-[var(--c)] peer-checked:border-[var(--c)] peer-checked:bg-[var(--c)] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0E6E66]"
        >
          <IconCheck className="h-3.5 w-3.5" />
        </span>
      </label>

      <span className="flex min-w-0 flex-1">
        <button
          type="button"
          onClick={onStartEdit}
          title="Click to edit"
          className={`cursor-text text-left text-[17px] leading-[1.35] [overflow-wrap:anywhere] focus-visible:rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0E6E66] ${
            item.checked
              ? "text-[#4A5568] line-through decoration-[#B8C1CE]"
              : "text-[#111827]"
          }`}
        >
          {item.text}
        </button>
      </span>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${item.text}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-[#AEB7C4] transition hover:bg-[#FDECEA] hover:text-[#B42318] focus-visible:opacity-100 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <IconTrash className="h-4 w-4" />
      </button>
    </li>
  );
}

type ChecklistTabProps = {
  checklist: CheckItem[];
  updateChecklist: (checklist: CheckItem[]) => void;
};

export default function ChecklistTab({
  checklist,
  updateChecklist,
}: ChecklistTabProps) {
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [addingIn, setAddingIn] =
    useState<string | null>(null);

  const [topAdd, setTopAdd] =
    useState<string | null>(null);

  const [showToast, , toastNode] = useToast();

  const itemsByCategory = useMemo(() => {
    return CATEGORIES.reduce<Record<string, CheckItem[]>>(
      (result, category) => {
        result[category.label] = checklist.filter(
          (item) => item.category === category.label
        );

        return result;
      },
      {}
    );
  }, [checklist]);

  const count = useCallback(
    (category: Category) => {
      const items =
        itemsByCategory[category.label] ?? [];

      return {
        done: items.filter((item) => item.checked).length,
        all: items.length,
      };
    },
    [itemsByCategory]
  );

  const totals = useMemo(() => {
    const done = checklist.filter(
      (item) => item.checked
    ).length;

    return {
      done,
      all: checklist.length,
    };
  }, [checklist]);

  const pct = (
    done: number,
    all: number
  ): number => {
    return all === 0
      ? 0
      : Math.round((done / all) * 100);
  };

  const visible = CATEGORIES.filter(
    (category) =>
      (itemsByCategory[category.label] ?? []).length > 0
  );

  const patchItem = (
    id: number,
    patch: Partial<CheckItem>
  ) => {
    updateChecklist(
      checklist.map((item) =>
        item.id === id
          ? { ...item, ...patch }
          : item
      )
    );
  };

  const addItem = (
    category: string,
    text: string
  ) => {
    const id =
      checklist.length === 0
        ? 1
        : Math.max(
            ...checklist.map((item) => item.id)
          ) + 1;

    updateChecklist([
      ...checklist,
      {
        id,
        text,
        checked: false,
        category,
      },
    ]);
  };

const deleteItem = (item: CheckItem) => {
    const index = checklist.findIndex(
        (current) => current.id === item.id
    );

    if (index === -1) return;

    const removed = checklist[index];

    updateChecklist(
        checklist.filter(
            (current) => current.id !== item.id
        )
    );

    showToast(
        `Deleted “${removed.text}”`,
        () => {
            if (checklist.some((current) => current.id === removed.id)) {
                return;
            }

            const next = [...checklist];

            next.splice(
                Math.min(index, next.length),
                0,
                removed
            );

            updateChecklist(next);
        }
    );
};

  return (
    <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-9 px-3 pb-12 pt-3 min-[901px]:grid-cols-[250px_minmax(0,1fr)] sm:px-6">
      {/* Categories */}
      <nav
        aria-label="Checklist categories"
        className="sticky top-4 hidden max-h-[calc(100vh-32px)] flex-col gap-1 self-start overflow-y-auto p-1 min-[901px]:flex"
      >
        <h2 className="mb-2 ml-2.5 mt-0 text-base font-bold text-[#2F3A4D]">
          Categories
        </h2>

        {visible.map((category) => {
          const x = count(category);
          const Icon = category.icon;

          return (
            <a
              key={category.key}
              href={`#cat-${category.key}`}
              style={
                {
                  "--c": category.c,
                  "--cb": category.cb,
                } as React.CSSProperties
              }
              className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2.5 rounded-xl px-2.5 py-2 text-[#111827] no-underline hover:bg-white"
            >
              <span className="grid h-8 w-8 place-items-center justify-self-center rounded-[10px] bg-[var(--cb)] text-[var(--c)]">
                <Icon className="h-[18px] w-[18px]" />
              </span>

              <span className="min-w-0 leading-[1.3]">
                <b className="block text-base font-bold">
                  {category.label}
                </b>

                <span className="block text-sm text-[#4A5568]">
                  {x.done} of {x.all}
                </span>

                <span className="mt-1.5 block h-1 overflow-hidden rounded-sm bg-[#F4F6FA]">
                  <i
                    className="block h-full rounded-sm bg-[var(--c)]"
                    style={{
                      width: `${pct(
                        x.done,
                        x.all
                      )}%`,
                    }}
                  />
                </span>
              </span>
            </a>
          );
        })}
      </nav>

      <main className="flex min-w-0 flex-col gap-5">
        {/* Summary */}
        <section
          aria-labelledby="prep-h"
          className="flex flex-wrap items-end justify-between gap-4 rounded-[20px] bg-white p-[18px] shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)] sm:rounded-3xl sm:px-7 sm:py-[22px]"
        >
          <div>
            <h2
              id="prep-h"
              className="m-0 text-[22px] font-extrabold tracking-[-0.01em]"
            >
              Trip preparation
            </h2>

            <p className="mb-0 mt-0.5 text-[15px] text-[#4A5568]">
              {totals.done} of {totals.all} done
              {totals.all - totals.done
                ? `, ${totals.all - totals.done} left`
                : ""}
            </p>
          </div>

          <span className="text-[32px] font-extrabold leading-none tracking-[-0.03em] sm:text-[40px]">
            {pct(totals.done, totals.all)}%
          </span>
        </section>

        {/* Top Add Item */}
        {topAdd ? (
          (() => {
            const category = CATEGORIES.find(
              (item) => item.key === topAdd
            );

            if (!category) {
              return null;
            }

            const Icon = category.icon;

            return (
              <InlineForm
                keepOpen
                label={`New item for ${category.label}`}
                placeholder="What do you need to prepare?"
                onSave={(value) => {
                  addItem(category.label, value);
                  showToast(`Added to ${category.label}`);
                }}
                onCancel={() => setTopAdd(null)}
                className="flex-wrap rounded-[14px] border border-[#E1E5EC] bg-white py-2 pl-2.5 pr-2 sm:flex-nowrap"
              >
                <span
                  style={
                    {
                      "--c": category.c,
                      "--cb": category.cb,
                    } as React.CSSProperties
                  }
                  className="hidden md:inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--cb)] pl-2 pr-3 text-[13px] font-bold text-[var(--c)]"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </span>
              </InlineForm>
            );
          })()
        ) : (
          <div
            role="group"
            aria-label="Add an item"
            className="flex flex-wrap items-center gap-3 rounded-[14px] border border-dashed border-[#B8C1CE] bg-[#F4F6FA] p-2.5 sm:py-2.5 sm:pl-4 sm:pr-3"
          >
            <span className="text-[15px] font-bold text-[#2F3A4D]">
              + Add item
            </span>

            <span className="grid w-full grid-cols-3 gap-1.5 sm:ml-auto sm:flex sm:w-auto sm:flex-wrap">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => {
                      setTopAdd(category.key);
                      setAddingIn(null);
                      setEditingId(null);
                    }}
                    style={
                      {
                        "--c": category.c,
                        "--cb": category.cb,
                      } as React.CSSProperties
                    }
                    className="inline-flex h-[36px] items-center justify-center gap-[5px] rounded-full border border-dashed border-[#B8C1CE] bg-white px-1 text-[13px] font-bold leading-none text-[var(--c)] hover:border-solid hover:border-[var(--c)] hover:bg-[var(--cb)] sm:px-2.5"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {category.label}
                  </button>
                );
              })}
            </span>
          </div>
        )}

        {/* Category Cards */}
        <div className="flex flex-col gap-7">
          {visible.map((category) => {
            const x = count(category);
            const Icon = category.icon;
            const items =
              itemsByCategory[category.label] ?? [];

            return (
              <section
                key={category.key}
                id={`cat-${category.key}`}
                aria-label={category.label}
                style={
                  {
                    "--c": category.c,
                    "--cb": category.cb,
                  } as React.CSSProperties
                }
                className="scroll-mt-3 rounded-[20px] bg-white shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)] sm:rounded-3xl"
              >
                <div className="sticky top-0 z-[4] rounded-t-[20px] border-b border-[#E1E5EC] bg-white px-[18px] pb-3.5 pt-[18px] sm:rounded-t-3xl sm:px-7 sm:pb-4 sm:pt-[22px]">
                  <div className="flex items-center gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--cb)] text-[var(--c)] sm:h-11 sm:w-11 sm:rounded-[14px]">
                      <Icon />
                    </span>

                    <span className="flex flex-col leading-[1.25]">
                      <b className="text-[19px] font-extrabold sm:text-[22px]">
                        {category.label}
                      </b>

                      <span className="text-[15px] text-[#4A5568]">
                        {x.done} of {x.all} done
                      </span>
                    </span>

                    <span className="ml-auto text-lg font-extrabold text-[var(--c)]">
                      {pct(x.done, x.all)}%
                    </span>
                  </div>

                  <div className="mt-3.5 h-1.5 overflow-hidden rounded-[3px] bg-[#F4F6FA]">
                    <i
                      className="block h-full rounded-[3px] bg-[var(--c)] transition-[width] duration-300"
                      style={{
                        width: `${pct(
                          x.done,
                          x.all
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <ul className="m-0 list-none px-3 pb-0.5 pt-1.5 sm:px-7 sm:pb-1 sm:pt-2.5">
                  {items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      color={category.c}
                      editing={
                        editingId === item.id
                      }
                      onToggle={() =>
                        patchItem(item.id, {
                          checked: !item.checked,
                        })
                      }
                      onStartEdit={() => {
                        setEditingId(item.id);
                        setAddingIn(null);
                      }}
                      onSaveEdit={(text) => {
                        patchItem(item.id, { text });
                        setEditingId(null);
                      }}
                      onCancelEdit={() =>
                        setEditingId(null)
                      }
                      onDelete={() =>
                        deleteItem(item)
                      }
                    />
                  ))}
                </ul>

                <div className="px-3 pb-5 pt-2 sm:px-7 sm:pb-[26px] sm:pt-2.5">
                  {addingIn === category.key ? (
                    <InlineForm
                      keepOpen
                      label={`New item for ${category.label}`}
                      placeholder="What do you need to prepare?"
                      onSave={(value) =>
                        addItem(
                          category.label,
                          value
                        )
                      }
                      onCancel={() =>
                        setAddingIn(null)
                      }
                      className="rounded-[14px] border border-dashed border-[#B8C1CE] bg-[#F4F6FA] py-2 pl-2.5 pr-2"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAddingIn(category.key);
                        setEditingId(null);
                        setTopAdd(null);
                      }}
                      className="flex min-h-[58px] w-full items-center rounded-[14px] border border-dashed border-[#B8C1CE] bg-[#F4F6FA] px-4 text-left text-[15px] font-bold text-[#2F3A4D] transition hover:border-solid hover:border-[var(--c)] hover:bg-[var(--cb)] hover:text-[var(--c)]"
                    >
                      + Add item
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {toastNode}
    </div>
  );
}
