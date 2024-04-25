import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);
  
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
        // console.log(stats);

        const DamageRelations = await Promise.all(
          types.map(async(i) => {
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
          DamageRelations
        }     
        setPokemon(formattedPokemonData)
        setIsLoading(false);
      }           
    } catch (error) {
      console.log(error);      
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

  
  if(isLoading) return <div>...Loading</div>
  return (
    <div>detailpage</div>
  )
}

export default DetailPage