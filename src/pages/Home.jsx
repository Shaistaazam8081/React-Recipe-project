
import React, { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useEffect } from 'react'
import axios from 'axios'


function Home() {

  const [recipes, setRecipes] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  async function fetchRecipes(skipCount, query) {
    setLoading(true)
    try {
      let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`
      if (query) {
        url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`
      }
      const { data } = await axios.get(url)
      console.log(data)
      setRecipes((prev) =>
        skipCount === 0 ? data.recipes : [...prev, ...data.recipes]); //agr skip count 0 h to total data dikha do , agr kuch h to tumko existting data me add krna h 
      setTotal(data.total);
    } catch (error) {
      setErrorMsg("please try again later")
    }
    setLoading(false)
  }
  // jb kuch API me krna hota h to useEffect use krte h
  useEffect(() => {
    fetchRecipes(0);
  }, [])

  function handleSearch(e) {
    //  console.log(e.target)
    e.preventDefault()

    const form = new FormData(e.target)
    let query = form.get("query").trim()

    setSearchQuery(query);

    if (query) {
      fetchRecipes(0, query)
    }
  }




  if (errorMsg) {
    return (
      <main className='max-w-6xl mx-auto px-4 py-8 '>
        <p className='text-accent'> {errorMsg}</p>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
        <input
          name="query"
          type="text"
          placeholder="Search recipes..."
          className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
        />
        <button type="submit" className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
          Search
        </button>
      </form>

      {loading && <p className="text-center py-6 text-muted"> Loading.....</p>}
      {!loading && recipes.length === 0 && (
        <p className="text-center py-6 text-muted"> {`No recipes found for '${searchQuery}'`}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {recipes.length < total && <div className="text-center mt-8">
        <button
          type="button"
          onClick={() => fetchRecipes(recipes.length, searchQuery)}
          className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
        >

          Load More
        </button>
      </div>}
    </main>
  );
}

export default Home;


// Fetching recipes from an API using Axios.
// Storing API data in useState.
// Displaying recipes using .map().
//
// Total data kitna h for ex - we have 50 recipe, to hmne code me (total,setTotal) = useState()
// setTotal.data() run kara diya
// skip is liye lagate h taaki wo data aa gya h , ab doosre req me wo data skip kr do .
// limit ka use krte h, 1 req me kitna data aa yega ye fix krne ke liye
// spred arrya lete h taaki data merge kr paaye ek sath , nested array me data naa aaye, ek sath total aaye.
// useEffect ke through first time req jaayegi, first req me skip 0 hogi.
// spread data se prev rakha rhega,new data aayega , load krogi to
//
// {loading && <p className="text-center py-6 text-muted"> Loading.....</p>}
      // {!loading && recipes.length === 0 && (
      //   <p className="text-center py-6 text-muted"> {`No recipes found for '${searchQuery}'`}</p>
      // )}  //jb  loading true hogi to ye nhi dikhega , false hogi to hi ye dikhega aur recipe 0 hogi.
//



