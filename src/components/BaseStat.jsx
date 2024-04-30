import React, { useEffect, useRef } from 'react'

const BaseStat = ({valueStat, nameStat, type}) => {
  console.log(valueStat, nameStat, type)
  const bg = `bg-${type}`;

  const ref = useRef(null);
  
  useEffect(() => {
    const setValueStat = ref.current;
    const calc = valueStat * (100/255)
    setValueStat.style.width = calc + '%';
  }, [])  

  return (
    <tr className='w-full text-white'>
      <td className='sm:px-5'>
        {nameStat}
      </td>
      <td className='px-2 sm:px-3'>
        {valueStat}
      </td>
      <td>
        <div className={`flex items-start h-2 min-w-[10rem] overflow-hidden rounded bg-gray-600`}>
          <div className={`h-3 ${bg}`} ref={ref}></div>
        </div>
      </td>
      <td className='px-2 sm:px-5'>255</td>
    </tr>
  )
}

export default BaseStat