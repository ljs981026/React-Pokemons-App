import React from 'react'
import { useEffect } from 'react';

const DamageRelations = ({damages}) => {
  console.log(damages);
  
  useEffect(() => {
    const arrayDamage = damages.map((damage) => separateObjectBetweenToAndFrom(damage));    
    console.log(arrayDamage)
    if(arrayDamage.length == 2) {
      // 합치는 부분
      const obj = joinDamageRelations(arrayDamage);
      console.log(obj)
    } else {
      postDamageValue(arrayDamage[0].from);
    }
  }, [])

  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, 'to'),
      from: joinObjects(props, 'from')
    }
  }

  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
    }
  }

  const joinObjects = (props, string) => {
    const key = string;
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];
    const result = Object.entries(secondArrayValue)
      .reduce((acc, [keyName, value]) => {        
        const result = firstArrayValue[keyName].concat(value);      
        return(acc = {[keyName]: result, ...acc})
      }, {})
    return result;
  }

  const postDamageValue = (props) => {
    const result = Object.entries(props)
    .reduce((acc, [keyName, value]) => {
      const key = keyName;

      const valueOfKeyName = {
        double_damage: '2x',
        half_damage: '0.5x',
        no_damage: '0x'
      };      
      return (acc = {[keyName]: value.map(i => ({
        damageValue: valueOfKeyName[key],
        ...i
      })),
      ...acc
    })      
    }, {})
  }

  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations('_from', damage);
    const to = filterDamageRelations('_to', damage);
    return { from, to };
  }

  const filterDamageRelations = (valuefilter, damage) => {
    const result = Object.entries(damage).filter(([keyName, value]) => {      
      return keyName.includes(valuefilter);
    }).reduce((acc, [keyName, value]) => {
      const keyWithValueFilterRemove = keyName.replace(valuefilter, '')
      return (acc = {[keyWithValueFilterRemove]: value, ...acc})
    }, {}) 
    return result;
  }




  return (
    <div>DamageRelations</div>
  )
}

export default DamageRelations