import { supabase } from '@aw/lib/database';
import { IRecipe } from '@aw/utils/interface';
import React, { useEffect, useState } from 'react';

interface ViewRecipeProps {
  idrecipe: number;
}

export default function ViewRecipe({ idrecipe }: ViewRecipeProps) {
  const [recipe, setRecipe] = useState<IRecipe>()

  async function loadRecipe() {
    const { data } = await supabase.from('recipes').select('*').eq('id', idrecipe)
    if (data) {
      setRecipe(data[0])
    }
  }

  useEffect(() => {
    loadRecipe()
  }, [])

  return (
    <div>
      <h2 className='text-lg font-semibold mb-2'>{recipe?.nameproduct}</h2>
      <ul>
        <li className='font-semibold mt-2'>Ingredientes:</li>
        {
          recipe?.ingredients.map(item => (
            <li key={item.name}>{item.amount} - {item.name} - {item.conditions}</li>
          ))
        }
      </ul>
      <ul>
        <li className='font-semibold mt-2'>Preparo:</li>
        <li>{recipe?.preparation}</li>
      </ul>
      <ul>
        <li className='font-semibold mt-2'>Tempo de cozimento:</li>
        <li>{recipe?.cooking}</li>
      </ul>
    </div>
  )
}