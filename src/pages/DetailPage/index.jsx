import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan'; 
import { GreaterThan } from '../../assets/GreaterThan';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance';
import { Vector } from '../../assets/Vector';
import Type from '../../components/Type';
import BaseStat from '../../components/BaseStat';
import DamageRelations from '../../components/DamageRelations';
import DamageModal from '../../components/DamageModal';



const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`
  useEffect(() => {
    fetchPokemonData();
  }, [])

  const fetchPokemonData = async () => {
    const url = `${baseUrl}${pokemonId}`;
    try {
      const {data: pokemonData} = await axios.get(url);

      if(pokemonData) {
        const {name, id, types, weight, height, stats, abilities } = pokemonData;
        const nextAndPreviousPokemon = await getNextAndPeviousPokemon(id);        

        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations
          })
        )
        const formattedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
          types: types.map(type => type.type.name)
        }             
        setPokemon(formattedPokemonData)
        setIsLoading(false);
      }           
    } catch (error) {
      console.log(error);     
      setIsLoading(false); 
    }
  }  

  const formatPokemonAbilities = (abilities) => {    
    return abilities.filter((_, index) => index <= 1).map((obj) => obj.ability.name.replaceAll('-',' '))
  }

  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEP,
    statSPD
  ]) => {return [
    {name: 'Hit Points', baseStat: statHP.base_stat},
    {name: 'Attack', baseStat: statATK.base_stat},
    {name: 'Defense', baseStat: statDEP.base_stat},
    {name: 'Special Attack', baseStat: statSATK.base_stat},
    {name: 'Special Defense', baseStat: statSDEP.base_stat},
    {name: 'Speed', baseStat: statSPD.base_stat},
    ]
  }

  const getNextAndPeviousPokemon = async (id) => {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id-1}`;    
    const { data: pokemonData} = await axios.get(urlPokemon);

    const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));

    const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous));
    
    return {
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name
    }
  }

  
  if(isLoading) {
    return (
      <div className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}>
        <Loading className='w-12 h-12 z-50 animation-spin text-slate-900' />
      </div>      
    )
  }
  if(!isLoading && !pokemon)
  {
    return (
      <div>...NOT FOUND</div>
    )
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;
  return (
    <article className='flex items-center gap-1 flex-col w-full'>
      <div className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}> 
        {pokemon.previous && (
          <Link className='absolute top-[40%] -translate-y-1/2 z-50 left-1' to={`/pokemon/${pokemon.previous}`}>
            <LessThan className='w-5 h-8 p-1' />
          </Link>
        )}
      
        {pokemon.next && (
          <Link className='absolute top-[40%] -translate-y-1/2 z-50 right-1' to={`/pokemon/${pokemon.next}`}>
            <GreaterThan className='w-5 h-8 p-1' />
          </Link>
        )}    

        <section className='w-full flex flex-col z-20 items-center justify-end relative h-full'>
          <div className='absolute z-30 top-6 flex items-center w-full justify-between px-2'>
            <div className='flex items-center gap-1'>
              <Link to={'/'}>
                <ArrowLeft className='w-6 h-8 text-zinc-200' />
              </Link>
              <h1 className='text-zinc-200 font-bold text-xl capitalize'>
                {pokemon.name}
              </h1>
            </div>
            <div className='text-zinc-200 font-bold text-md'>
              #{pokemon.id.toString().padStart(3, '00')}
            </div>
          </div>
          <div className='relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16'>
            <img 
              src={img} 
              width="100%" 
              height="auto" 
              loading="lazy" 
              alt={pokemon.name} 
              className={`object-contain h-full`} 
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>    
        <section className='w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4'>
          <div className='flex items-center justify-center gap-4'>
            {pokemon.types.map((type) => (
              <Type key={type} type={type} />
            ))}
          </div>
          <h2 className={`text-base font-semibold ${text}`}>
            정보
          </h2>
          <div className='flex w-full items-center justify-between max-w-[400px] text-center'>
            <div className='w-full'>
              <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
              <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-200'>
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>
            <div className='w-full'>
              <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
              <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-200'>
                <Vector />
                {pokemon.height}m
              </div>
            </div>
            <div className='w-full'>
              <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
              {pokemon.abilities.map((ability) => (
                <div key={ability} className='text-[0.5rem] text-zinc-100 capitalize'>
                  {ability}
                </div>
              ))}
            </div>                        
          </div>
          <h2 className={`text-base font-semibold ${text}`}>
            기본 능력치
          </h2>
          <div className='w-full'>
              <table>
                <tbody>
                  {pokemon.stats.map((stat) => (
                    <BaseStat 
                      key={stat.name}
                      valueStat={stat.baseStat}
                      nameStat={stat.name}
                      type={pokemon.types[0]}
                    />
                  ))}
                </tbody>
              </table>              
          </div>
          {/* {pokemon.DamageRelations && (
            <div className='w-10/12'>
              <h2 className={`text-base text-center font-semibold ${text}`}>
                <DamageRelations damages={pokemon.DamageRelations} />
              </h2>              
            </div>
          )} */}
        </section>        
      </div>
      {isModalOpen && <DamageModal setIsModalOpen={setIsModalOpen} damages={pokemon.DamageRelations} />}
    </article>  
  )
}

export default DetailPage