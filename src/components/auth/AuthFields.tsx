import { useState, type ComponentType } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldLabelClass = "text-sm font-medium text-foreground";
const fieldInputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent/30";

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
};

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  hint,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block" htmlFor={id}>
      <span className={fieldLabelClass}>{label}</span>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(fieldInputClass, "pr-11")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="touch-target absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted hover:text-foreground active:text-foreground transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </label>
  );
}

type TextInputProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

export function TextInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: TextInputProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className={fieldLabelClass}>{label}</span>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(fieldInputClass, "mt-1.5")}
      />
    </label>
  );
}

type RoleOption<T extends string> = {
  value: T;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

type RoleSelectProps<T extends string> = {
  label: string;
  value: T;
  options: RoleOption<T>[];
  onChange: (value: T) => void;
};

/** Segmented role picker — matches auth tab styling and input field rhythm */
export function RoleSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: RoleSelectProps<T>) {
  return (
    <div>
      <span className={fieldLabelClass}>{label}</span>
      <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-muted/20 p-1">
        {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => {
          const selected = value === optionValue;
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                selected
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              <Icon size={16} className={selected ? "text-accent" : "text-muted"} />
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AuthAlert({
  tone,
  children,
}: {
  tone: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const styles = {
    error: "text-red-700 bg-red-50 border-red-100",
    success: "text-emerald-800 bg-emerald-50 border-emerald-100",
    info: "text-amber-800 bg-amber-50 border-amber-100",
  };

  return (
    <p className={cn("text-sm rounded-xl px-4 py-3 border", styles[tone])}>
      {children}
    </p>
  );
}
