type MaxMessengerIconProps = {
  className?: string;
};

export function MaxMessengerIcon({ className = "" }: MaxMessengerIconProps) {
  return (
    // Native img for reliable sizing in small icon buttons.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/max.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      decoding="async"
      className={`block size-full scale-[1.34] object-cover object-center ${className}`}
    />
  );
}
