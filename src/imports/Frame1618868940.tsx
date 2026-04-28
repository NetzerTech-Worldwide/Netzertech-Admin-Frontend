import clsx from "clsx";
type HelperProps = {
  text: string;
  text1: string;
  additionalClassNames?: string;
};

function Helper({ text, text1, additionalClassNames = "" }: HelperProps) {
  return (
    <div className={clsx("content-stretch flex flex-col gap-[6px] items-start relative shrink-0", additionalClassNames)}>
      <p className="font-['Lato:Regular',sans-serif] relative shrink-0 text-[#666668] text-[14px] w-full">{text}</p>
      <p className="font-['Lato:SemiBold',sans-serif] relative shrink-0 text-[18px] text-black w-full">{text1}</p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white border-[#dcdee1] border-l border-r border-solid relative size-full">
      <div className="-translate-y-1/2 absolute capitalize content-stretch flex gap-[196px] items-center leading-[normal] left-[23px] not-italic top-[calc(50%+0.5px)]">
        <Helper text="Student Name" text1="Emma Wilson" additionalClassNames="w-[110px]" />
        <Helper text="Student ID" text1="STU001" additionalClassNames="w-[74px]" />
        <Helper text="Current Grade" text1="10th Grade" additionalClassNames="w-[97px]" />
        <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[112px]">
          <p className="font-['Lato:Regular',sans-serif] relative shrink-0 text-[#666668] text-[14px] w-full">Cumulative GPA</p>
          <p className="font-['Lato:SemiBold',sans-serif] relative shrink-0 text-[#216388] text-[18px] w-full">3.8</p>
        </div>
      </div>
    </div>
  );
}