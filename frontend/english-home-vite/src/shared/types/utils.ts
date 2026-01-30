import { Link as LocalizedLink } from '@shared/i18n/routing';
import { Link, type LinkComponentProps } from '@tanstack/react-router';
import type { ComponentProps } from 'react';
export type RouteType = LinkComponentProps<typeof Link>['to'];
export type LocalizedRouteType = ComponentProps<typeof LocalizedLink>['to'];

export type RouteWithoutLocale<T extends string | undefined> =
  T extends `/$locale${infer Rest}` ? Rest : T;

export type CustomExtract<T, U extends T> = U;
