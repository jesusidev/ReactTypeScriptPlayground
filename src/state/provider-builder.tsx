import type React from "react";
import type { JSXElementConstructor, ReactNode } from "react";

type InferProps<T> = T extends JSXElementConstructor<infer P> ? P : never;

type ProviderWithProps<T extends JSXElementConstructor<any>> = readonly [
  T,
  Omit<InferProps<T>, "children">,
];

type InferProviderArray<T extends ReadonlyArray<JSXElementConstructor<any>>> = {
  readonly [K in keyof T]: T[K] extends JSXElementConstructor<any>
    ? ProviderWithProps<T[K]>
    : never;
};

export type ProvidersProps<
  T extends ReadonlyArray<JSXElementConstructor<any>>,
> = {
  children: ReactNode;
  providers: InferProviderArray<T>;
};

function ProviderStack<T extends ReadonlyArray<JSXElementConstructor<any>>>({
  providers,
  children,
}: ProvidersProps<T>): React.ReactElement {
  return providers.reduceRight(
    (node, [Provider, props]) => (
      <Provider {...(props as any)}>{node}</Provider>
    ),
    <>{children}</>
  );
}

export function Providers<T extends ReadonlyArray<JSXElementConstructor<any>>>({
  children,
  providers,
}: ProvidersProps<T>): React.ReactElement {
  return <ProviderStack providers={providers}>{children}</ProviderStack>;
}
