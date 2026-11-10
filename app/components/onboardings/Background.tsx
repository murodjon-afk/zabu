import { FA, NEWS, NOTO, ghost } from "./constants";

export function Background() {
  return (
    <div aria-hidden="true">
      <span className={`${ghost} ${NOTO} -left-2 top-[96px] text-[130px] font-medium opacity-[0.07] sm:text-[220px] lg:-left-[1%] lg:top-[130px] lg:text-[300px]`}>Ҷ</span>
      <span className={`${ghost} ${FA} -right-1 top-[70px] text-[140px] font-medium opacity-[0.07] sm:text-[230px] lg:-right-[1%] lg:top-[100px] lg:text-[320px]`}>ف</span>
      <span className={`${ghost} ${NEWS} -bottom-5 left-[4%] text-[110px] italic opacity-[0.07] sm:text-[180px] lg:-bottom-[50px] lg:left-[9%] lg:text-[250px]`}>Aa</span>
      <span className={`${ghost} ${NOTO} -bottom-2.5 right-[4%] text-[100px] font-medium opacity-[0.07] sm:text-[170px] lg:-bottom-10 lg:right-[7%] lg:text-[230px]`}>Ӯ</span>
      <span className={`${ghost} ${NOTO} left-[6%] top-[170px] hidden -rotate-6 text-[52px] font-medium opacity-10 lg:block`}>салом</span>
      <span className={`${ghost} ${FA} right-[6%] top-[200px] hidden rotate-[5deg] text-[60px] opacity-10 lg:block`}>سلام</span>
      <span className={`${ghost} ${NEWS} right-[10%] top-[60px] hidden text-[40px] italic opacity-10 lg:block`}>hello</span>
    </div>
  );
}