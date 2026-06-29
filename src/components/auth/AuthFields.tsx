import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-border bg-white px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
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
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-accent/30"
        )}
      />
    </label>
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
