function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white h-[76px] relative shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border-[#dcdee1] border-l border-r border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <div className="-translate-y-1/2 absolute bg-[rgba(232,108,46,0.1)] h-[31px] left-[1092px] overflow-clip rounded-[5px] top-[calc(50%+0.5px)] w-[40px]">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[normal] left-[calc(50%-13px)] not-italic text-[#e86c2e] text-[20px] top-[calc(50%-6.5px)] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="-translate-y-1/2 absolute bg-[rgba(33,99,136,0.1)] h-[31px] left-[1092px] overflow-clip rounded-[5px] top-[calc(50%+0.5px)] w-[40px]">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[normal] left-[calc(50%-7px)] not-italic text-[#216388] text-[20px] top-[calc(50%-6.5px)] whitespace-nowrap">{text}</p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full">
      <div className="bg-white h-[94px] relative shrink-0 w-full">
        <div className="leading-[normal] not-italic overflow-clip relative rounded-[inherit] size-full text-[#666668] uppercase whitespace-nowrap">
          <p className="absolute font-['Lato:Medium',sans-serif] left-[24px] text-[16px] top-[calc(50%-9px)]">Subject</p>
          <p className="absolute font-['Lato:Bold',sans-serif] left-[24px] text-[12px] top-[17px]">2023–2024 — 8th Grade</p>
          <p className="absolute font-['Lato:Medium',sans-serif] left-[294px] text-[16px] top-[calc(50%-9px)]">Teacher</p>
          <p className="absolute font-['Lato:Medium',sans-serif] left-[837px] text-[16px] top-[calc(50%-9px)]">Score</p>
          <p className="absolute font-['Lato:Medium',sans-serif] left-[1092px] text-[16px] top-[calc(50%-6px)]">Grade</p>
          <p className="absolute font-['Lato:Medium',sans-serif] left-[569px] text-[16px] top-[calc(50%-9px)]">Credits</p>
        </div>
        <div aria-hidden="true" className="absolute border-[#dcdee1] border-b border-l border-r border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-white h-[76px] relative shrink-0 w-full">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <p className="absolute capitalize font-['Lato:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[16px] text-black top-[calc(50%-10px)] w-[96px]">Algebra I</p>
          <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[569px] lowercase not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">4</p>
          <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[837px] lowercase not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">94%</p>
          <p className="absolute capitalize font-['Lato:Regular',sans-serif] leading-[normal] left-[294px] not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">Mr. Adams</p>
          <Text text="A" />
        </div>
        <div aria-hidden="true" className="absolute border-[#dcdee1] border-l border-r border-solid inset-0 pointer-events-none" />
      </div>
      <Wrapper>
        <p className="absolute capitalize font-['Lato:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[16px] text-black top-[calc(50%-10px)] w-[109px]">Biology</p>
        <p className="absolute capitalize font-['Lato:Regular',sans-serif] leading-[normal] left-[294px] not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">Ms. Lee</p>
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[569px] lowercase not-italic text-[#666668] text-[16px] top-[29px] whitespace-nowrap">4</p>
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[837px] lowercase not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">90%</p>
        <Text text="A" />
      </Wrapper>
      <Wrapper>
        <p className="absolute capitalize font-['Lato:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[16px] text-black top-[calc(50%-9.75px)] w-[67px]">English 9</p>
        <p className="absolute capitalize font-['Lato:Regular',sans-serif] leading-[normal] left-[294px] not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">Mrs. Taylor</p>
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[569px] lowercase not-italic text-[#666668] text-[16px] top-[29px] whitespace-nowrap">4</p>
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[837px] lowercase not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">93%</p>
        <Text text="A" />
      </Wrapper>
      <Wrapper>
        <Text1 text="B+" />
        <p className="absolute capitalize font-['Lato:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[16px] text-black top-[calc(50%-9.75px)] w-[111px]">World History</p>
        <p className="absolute capitalize font-['Lato:Regular',sans-serif] leading-[normal] left-[294px] not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">Mr. Okon</p>
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[569px] lowercase not-italic text-[#666668] text-[16px] top-[29px] whitespace-nowrap">4</p>
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[837px] lowercase not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">85%</p>
      </Wrapper>
      <Wrapper>
        <div className="-translate-y-1/2 absolute bg-[rgba(33,99,136,0.1)] h-[31px] left-[1092px] overflow-clip rounded-[5px] top-[calc(50%+0.5px)] w-[40px]">
          <p className="absolute font-['Lato:Bold',sans-serif] leading-[normal] left-[calc(50%-13px)] not-italic text-[#216388] text-[20px] top-[calc(50%-6.5px)] whitespace-nowrap">A+</p>
        </div>
        <p className="absolute capitalize font-['Lato:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[16px] text-black top-[calc(50%-9.75px)] whitespace-nowrap">Intro to CS</p>
        <p className="absolute capitalize font-['Lato:Regular',sans-serif] leading-[normal] left-[294px] not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">Mr. t</p>
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[569px] lowercase not-italic text-[#666668] text-[16px] top-[29px] whitespace-nowrap">4</p>
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[837px] lowercase not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">98%</p>
      </Wrapper>
      <div className="bg-white h-[76px] relative shrink-0 w-full">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <p className="absolute capitalize font-['Lato:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[16px] text-black top-[calc(50%-9.75px)] whitespace-nowrap">Physical Ed.</p>
          <p className="absolute capitalize font-['Lato:Regular',sans-serif] leading-[normal] left-[294px] not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">Mr. ThankGod</p>
          <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[569px] lowercase not-italic text-[#666668] text-[16px] top-[29px] whitespace-nowrap">4</p>
          <p className="absolute font-['Lato:Regular',sans-serif] leading-[normal] left-[837px] lowercase not-italic text-[#666668] text-[16px] top-[calc(50%-9px)] whitespace-nowrap">87%</p>
          <Text1 text="B+" />
        </div>
        <div aria-hidden="true" className="absolute border border-[#dcdee1] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-white h-[58px] relative shrink-0 w-full">
        <div className="capitalize leading-[normal] not-italic overflow-clip relative rounded-[inherit] size-full text-[14px]">
          <p className="absolute font-['Lato:Medium',sans-serif] left-[24px] text-[#666668] top-[calc(50%-9.75px)] whitespace-nowrap">Term GPA</p>
          <p className="absolute font-['Lato:SemiBold',sans-serif] left-[1034px] text-[#216388] top-[calc(50%-8.75px)] whitespace-pre">{`3.6  |  Rank #8 / 120`}</p>
        </div>
        <div aria-hidden="true" className="absolute border-[#dcdee1] border-b border-l border-r border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[rgba(33,99,136,0.05)] h-[76px] relative rounded-bl-[24px] rounded-br-[24px] shrink-0 w-full">
        <div className="capitalize leading-[normal] not-italic overflow-clip relative rounded-[inherit] size-full text-[#216388] whitespace-nowrap">
          <p className="absolute font-['Lato:Medium',sans-serif] left-[24px] text-[16px] top-[calc(50%-9.75px)]">Cumulative GPA</p>
          <p className="absolute font-['Lato:SemiBold',sans-serif] left-[1085px] text-[20px] top-[calc(50%-11.75px)]">3.8 / 4.0</p>
        </div>
        <div aria-hidden="true" className="absolute border-[#dcdee1] border-b border-l border-r border-solid inset-0 pointer-events-none rounded-bl-[24px] rounded-br-[24px]" />
      </div>
    </div>
  );
}