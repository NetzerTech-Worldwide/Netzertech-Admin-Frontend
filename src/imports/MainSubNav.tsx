function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex items-center px-[24px] py-[32px] relative shrink-0">
      <button className="cursor-pointer relative rounded-tl-[12px] rounded-tr-[12px] shrink-0" data-name="SUB NAVIGATION">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative">{children}</div>
        </div>
      </button>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <Wrapper>
      <p className="font-['Lato:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666668] text-[20px] text-left whitespace-nowrap">{text}</p>
    </Wrapper>
  );
}

export default function MainSubNav() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-end relative rounded-tl-[24px] rounded-tr-[24px] size-full" data-name="MAIN SUB NAV">
      <div aria-hidden="true" className="absolute border border-[#dcdee1] border-solid inset-0 pointer-events-none rounded-tl-[24px] rounded-tr-[24px]" />
      <Wrapper>
        <p className="font-['Lato:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#5d5c5c] text-[20px] text-left whitespace-nowrap">Overview</p>
      </Wrapper>
      <Text text="Academic History" />
      <div className="content-stretch flex items-center px-[24px] py-[32px] relative shrink-0">
        <div aria-hidden="true" className="absolute border-[#216388] border-b-3 border-solid inset-0 pointer-events-none" />
        <div className="content-stretch flex items-center justify-center relative shrink-0">
          <p className="font-['Lato:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#216388] text-[20px] whitespace-nowrap">Transcript</p>
        </div>
      </div>
      <Text text="Report Cards" />
      <Text text="Documents" />
    </div>
  );
}