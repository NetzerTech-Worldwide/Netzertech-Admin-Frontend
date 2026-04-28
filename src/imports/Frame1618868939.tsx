export default function Frame() {
  return (
    <div className="bg-white border-[#dcdee1] border-b border-l border-r border-solid relative size-full">
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[6px] items-start leading-[normal] left-[23px] not-italic top-[calc(50%+1px)] w-[193px]">
        <p className="font-['Lato:Medium',sans-serif] relative shrink-0 text-[20px] text-black w-full">Official Transcript</p>
        <p className="font-['Lato:Regular',sans-serif] relative shrink-0 text-[#5d5c5c] text-[14px] w-full">Cumulative academic record</p>
      </div>
    </div>
  );
}