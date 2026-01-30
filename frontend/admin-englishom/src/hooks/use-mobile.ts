import useMediaQuery from './use-media-query';

const useIsMobile = () => {
  return useMediaQuery({ maxWidth: 780 });
};

export default useIsMobile;
