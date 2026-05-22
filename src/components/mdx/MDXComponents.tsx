import type { ComponentType } from "react";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { ToggleBlock } from "./Toggle";

export const MDXComponents: Record<string, ComponentType<any>> = {
  Callout: Callout as ComponentType<any>,
  CodeBlock: CodeBlock as ComponentType<any>,
  Toggle: ToggleBlock as ComponentType<any>,
  wrapper: (({ children }: { children: React.ReactNode }) => <>{children}</>) as ComponentType<any>,
};
