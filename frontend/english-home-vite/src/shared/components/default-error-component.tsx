import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import type { AxiosError } from 'axios';
import i18next from 'i18next';
import {
  AlertTriangle,
  Clock,
  Home,
  Lock,
  RefreshCw,
  Server,
  WifiOff,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DefaultErrorComponent = ({ error }: { error?: Error }) => {
  const { t } = useTranslation();
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    const statusCode = getStatusCode(error);
    // For authentication errors, redirect to login
    if (statusCode === 401) {
      window.location.href = `/${i18next.language}/login`;
    } else {
      window.location.href = `/${i18next.language}/app`;
    }
  };

  // Get button text based on error type
  const getActionButtonText = (error?: Error): string => {
    const statusCode = getStatusCode(error);
    return statusCode === 401
      ? t('Auth.login-form.login-button')
      : t('Global.goToHome');
  };

  // Get appropriate icon based on error type
  const getErrorIcon = (error?: Error) => {
    // Check for network connectivity first
    if (!navigator.onLine) {
      return <WifiOff className="text-destructive h-8 w-8" />;
    }

    const statusCode = getStatusCode(error);

    switch (statusCode) {
      case 401:
      case 403:
        return <Lock className="text-destructive h-8 w-8" />;
      case 404:
        return <AlertTriangle className="text-destructive h-8 w-8" />;
      case 408:
      case 504:
        return <Clock className="text-destructive h-8 w-8" />;
      case 500:
      case 502:
      case 503:
        return <Server className="text-destructive h-8 w-8" />;
      case 429:
        return <Clock className="text-destructive h-8 w-8" />;
      default:
        return <AlertTriangle className="text-destructive h-8 w-8" />;
    }
  };

  // Extract status code from error
  const getStatusCode = (error?: Error): number | null => {
    if (!error) return null;

    // Check if it's an AxiosError
    const axiosError = error as AxiosError;
    if (axiosError.response?.status) {
      return axiosError.response.status;
    }

    // Check if status code is in the error message
    const statusMatch =
      error.message.match(/status code (\d{3})/i) ||
      error.message.match(/(\d{3})/);
    if (statusMatch) {
      return parseInt(statusMatch[1]);
    }

    return null;
  };

  // Get custom message based on status code
  const getErrorMessage = (
    error?: Error
  ): { title: string; message: string } => {
    const statusCode = getStatusCode(error);

    // Check for network connectivity issues
    if (!navigator.onLine) {
      return {
        title: t('Global.errorMessages.networkError.title'),
        message: t('Global.errorMessages.networkError.message'),
      };
    }

    switch (statusCode) {
      case 400:
        return {
          title: t('Global.errorMessages.badRequest.title'),
          message: t('Global.errorMessages.badRequest.message'),
        };
      case 401:
        return {
          title: t('Global.errorMessages.unauthorized.title'),
          message: t('Global.errorMessages.unauthorized.message'),
        };
      case 403:
        return {
          title: t('Global.errorMessages.forbidden.title'),
          message: t('Global.errorMessages.forbidden.message'),
        };
      case 404:
        return {
          title: t('Global.errorMessages.notFound.title'),
          message: t('Global.errorMessages.notFound.message'),
        };
      case 408:
        return {
          title: t('Global.errorMessages.timeout.title'),
          message: t('Global.errorMessages.timeout.message'),
        };
      case 429:
        return {
          title: t('Global.errorMessages.tooManyRequests.title'),
          message: t('Global.errorMessages.tooManyRequests.message'),
        };
      case 500:
        return {
          title: t('Global.errorMessages.internalServerError.title'),
          message: t('Global.errorMessages.internalServerError.message'),
        };
      case 502:
        return {
          title: t('Global.errorMessages.badGateway.title'),
          message: t('Global.errorMessages.badGateway.message'),
        };
      case 503:
        return {
          title: t('Global.errorMessages.unavailableService.title'),
          message: t('Global.errorMessages.unavailableService.message'),
        };
      case 504:
        return {
          title: t('Global.errorMessages.gatewayTimeout.title'),
          message: t('Global.errorMessages.gatewayTimeout.message'),
        };
      default:
        return {
          title: t('Global.errorMessages.unexpectedError.title'),
          message: t('Global.errorMessages.unexpectedError.message'),
        };
    }
  };

  const { title, message } = getErrorMessage(error);

  return (
    <div className="bg-background flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {getErrorIcon(error)}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">{message}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {getStatusCode(error) !== 401 && (
              <Button
                onClick={handleRefresh}
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t('Global.tryAgain')}
              </Button>
            )}
            <Button
              onClick={handleGoHome}
              variant={getStatusCode(error) === 401 ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              {getActionButtonText(error)}
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && error?.stack && (
            <details className="mt-4 text-left">
              {}
              <summary className="text-muted-foreground cursor-pointer text-sm font-medium">
                Error Details (Development Only)
              </summary>
              <pre className="bg-muted mt-2 overflow-auto rounded-md p-3 text-xs">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DefaultErrorComponent;
