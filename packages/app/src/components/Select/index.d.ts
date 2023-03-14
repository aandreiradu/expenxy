import 'react';

declare module Extended {
  interface ExtendedOption
    extends React.DetailedHTMLProps<
      React.OptionHTMLAttributes<HTMLOptionElement>
    > {
    bankingProductId?: string;
  }
}
