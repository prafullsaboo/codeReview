const parentClasses = `inline-block relative w-[80px] h-[80px]
[&>*:nth-child(1)]:after:top-[63px] [&>*:nth-child(1)]:after:left-[63px]
[&>*:nth-child(2)]:after:top-[68px] [&>*:nth-child(2)]:after:left-[56px]
[&>*:nth-child(3)]:after:top-[71px] [&>*:nth-child(3)]:after:left-[48px]
[&>*:nth-child(4)]:after:top-[72px] [&>*:nth-child(4)]:after:left-[40px]
[&>*:nth-child(5)]:after:top-[71px] [&>*:nth-child(5)]:after:left-[32px]
[&>*:nth-child(6)]:after:top-[68px] [&>*:nth-child(6)]:after:left-[24px]
[&>*:nth-child(7)]:after:top-[63px] [&>*:nth-child(7)]:after:left-[17px]
[&>*:nth-child(8)]:after:top-[56px] [&>*:nth-child(8)]:after:left-[12px]
[&>*:nth-child(1)]:animation-delay-m36
[&>*:nth-child(2)]:animation-delay-m72
[&>*:nth-child(3)]:animation-delay-m108
[&>*:nth-child(4)]:animation-delay-m144
[&>*:nth-child(5)]:animation-delay-m180
[&>*:nth-child(6)]:animation-delay-m216
[&>*:nth-child(7)]:animation-delay-m252
[&>*:nth-child(8)]:animation-delay-m288
`
const spinnerClasses = `animate-ldsLoader origin-[40px_40px] after:content-[' '] after:block after:absolute after:w-[7px] after:h-[7px] 
after:rounded-full after:bg-brand-500 after:mt-[-4px] after:ml-[-4px]`
export const Spinner = () => {
  return (
    <div className={parentClasses}>
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className={spinnerClasses}></div>
      ))}
    </div>
  );
};

export default Spinner;
