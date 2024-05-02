import React, { useState } from 'react'
import { useEffect } from 'react';
import Type from './Type';

const DamageRelations = ({damages}) => {  
  
  const [damagePokemonForm, SetDamagePokemonForm] = useState({});
  console.log(Object.entries(damagePokemonForm));
  useEffect(() => {
    const arrayDamage = damages.map((damage) => separateObjectBetweenToAndFrom(damage));    
    if(arrayDamage.length == 2) {
      // 합치는 부분
      const obj = joinDamageRelations(arrayDamage);
      SetDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      SetDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }    
  }, [damages])

  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, 'to'),
      from: joinObjects(props, 'from')
    }
  }

  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: '4x',
      half_damage: '0.25x',
      no_damage: '0x'
    }

    return Object.entries(props)
      .reduce((acc, [keyName, value]) => {
        const key = keyName;

        const verifiedValue = filterForUniqueValues(
          value,
          duplicateValues[key]
        )
        return (acc = {[keyName]: verifiedValue, ...acc});
      }, {})
  }

  const filterForUniqueValues = (valueForFiltering, damageValue) => {    
    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;
      const filterACC = acc?.filter((a) => a.name !== name);
      
      return filterACC.length === acc.length 
      ? (acc = [currentValue, ...acc])
      : (acc = [{damageValue: damageValue, name, url}, ...filterACC])
    }, [])
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
    return result;
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
    <div className='flex gap-2 flex-col'>
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm)
            .map(([keyName, value]) => {
              const key = keyName;
              const valuesOfKeyName = {
                double_damage: 'Weak',
                half_damage: 'Resistant',
                no_damage: 'Immune'
              }
              return (
                <div key={key}>
                  <h3 className='capitalize font-medium text-sm md:text-base text-slate-500 text-center'>
                    {valuesOfKeyName[key]}
                  </h3>
                  <div className='flex flex-wrap gap-1 justify-center'>
                    {value.length > 0 ? (
                      value.map(({name, url, damageValue}) => {
                        return (
                          <Type type={name} key={url} damageValue={damageValue} />
                        )
                      })
                    ) : (
                      <Type type={'none'} key={'none'} />
                    )}
                  </div>
                </div>
              )
            })  
          }
        </>
      ) : <div></div>}
    </div>
  )
}

export default DamageRelations