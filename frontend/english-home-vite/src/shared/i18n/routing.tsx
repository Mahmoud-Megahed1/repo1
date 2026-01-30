import useLocale from '@hooks/use-locale';
import {
  Link as RouterLink,
  useLocation,
  useNavigate as useTanstackNavigate,
  type LinkComponentProps,
} from '@tanstack/react-router';
import { type FC } from 'react';
type RouteWithoutLocale<T extends string | undefined> =
  T extends `/$locale${infer Rest}` ? Rest : T;

type Props = Omit<LinkComponentProps<typeof RouterLink>, 'href' | 'to'> & {
  locale?: string;
  to?: RouteWithoutLocale<LinkComponentProps<typeof RouterLink>['to']>;
};

export const Link: FC<Props> = ({ locale, to, params, ...props }) => {
  const localeFromHook = useLocale();
  const currentLang = locale || localeFromHook;
  return (
    <RouterLink
      to={`/$locale${to}` as never}
      params={{
        locale: currentLang,
        ...(typeof params === 'object' ? params : {}),
      }}
      {...props}
    />
  );
};

export const usePathname = () => {
  const { pathname } = useLocation();
  return pathname.slice(3); // Remove leading slash and locale
};

type UseLocalizedNavigation = Omit<
  Parameters<ReturnType<typeof useTanstackNavigate>>['0'],
  'to'
> & {
  to?: RouteWithoutLocale<LinkComponentProps<typeof RouterLink>['to']>;
};
export const useNavigate = () => {
  const navigate = useTanstackNavigate();
  const locale = useLocale();
  return ({ to, params, ...rest }: UseLocalizedNavigation) => {
    navigate({
      to: `/$locale${to}`,
      params: {
        locale,
        ...(typeof params === 'object' ? params : {}),
      } as never,
      ...rest,
    });
  };
};
