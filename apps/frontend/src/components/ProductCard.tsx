import React, { startTransition } from 'react'

//destructure product below
const ProductCard = () => {
    return (
        <div className = "movie-card">
            <img src = {`#IMAGE LOCATION.png`} 
            alt = "#title"
            />

            <div className = "mt-4">
                <h3>#Title</h3>
                <div className = "content">
                    <div className = "rating">
                        <img src = "star.svg" alt="Star Icon"/>
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>

                    <span>•</span>
                    <p className = "lang">{original_language}</p>

                    <span>•</span>
                    <p className = "year">
                        {release_date ? release_date.split ('-')[0] : 'N/A'}
                    </p>
                </div>

            </div>

        </div>
    )
}