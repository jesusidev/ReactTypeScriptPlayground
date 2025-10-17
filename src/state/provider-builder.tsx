import type { JSXElementConstructor, ReactElement, ReactNode } from "react";

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

export function Providers<T extends ReadonlyArray<JSXElementConstructor<any>>>({
  children,
  providers,
}: ProvidersProps<T>): ReactElement {
  return providers.reduceRight(
    (node, [Provider, props]) => (
      <Provider key={Provider.name} {...(props as any)}>
        {node}
      </Provider>
    ),
    children || null
  ) as ReactElement;
}
