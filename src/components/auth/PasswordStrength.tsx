import { cn } from "@/lib/utils";
import { PASSWORD_RULES } from "@/lib/validation";

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  return (
    <ul className="mt-2 space-y-1">
      {PASSWORD_RULES.map(({ id, label, test }) => {
        const met = test(password);
        return (
          <li
            key={id}
            className={cn(
              "text-xs flex items-center gap-2",
              met ? "text-emerald-600" : "text-muted"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                met ? "bg-emerald-500" : "bg-border"
              )}
            />
            {label}
          </li>
        );
      })}
    </ul>
  );
}
