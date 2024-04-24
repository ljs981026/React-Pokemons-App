import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'

const DetailPage = () => {

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
        const {name, id, types, weight, height, stats, abilites } = pokemonData;
        const nextAndPreviousPokemon = await getNextAndPeviousPokemon(pokemonId);
        console.log(nextAndPreviousPokemon);
      }      

      console.log(pokemonData);
      
    } catch (error) {
      console.log(error);      
    }
  }

  const getNextAndPeviousPokemon = async (id) => {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id-1}`;    
    const { data: pokemonData} = await axios.get(urlPokemon);
    console.log(pokemonData);

    const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));

    const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous));
    
    console.log(previousResponse, nextResponse)

    return {
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name
    }
  }

  return (
    <div>detailpage</div>
  )
}

export default DetailPage