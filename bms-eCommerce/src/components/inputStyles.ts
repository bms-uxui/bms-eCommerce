const wrapperBase =
  "bg-white border border-[var(--color-neutral-300)] data-[hover=true]:bg-white data-[hover=true]:border-[var(--color-primary-400)] group-data-[focus=true]:border-[var(--color-primary)] group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-[var(--color-primary)]/20 group-data-[invalid=true]:border-[var(--color-critical)] shadow-none";

const inputBase =
  "text-[14px] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)]";

export const inputClassNames = {
  inputWrapper: `h-10 ${wrapperBase}`,
  input: inputBase,
};

export const inputClassNamesLg = {
  inputWrapper: `h-11 ${wrapperBase}`,
  input: inputBase,
};

export const inputClassNamesSm = {
  inputWrapper: `h-9 ${wrapperBase}`,
  input: inputBase,
};
