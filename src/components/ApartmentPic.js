
import React from 'react';
import Streetview from 'react-google-streetview';

export default function ApartmentPic(){
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

    const streetViewPanoramaOptions = {

        position: { lat: JSON.parse(localStorage.getItem('lat')), 
                    lng: JSON.parse(localStorage.getItem('lng')) 
                  },
        pov: { heading: -100, pitch: 0 },
        zoom: 1,
        source: 'outdoor'
    };
    return(
        <Streetview
            apiKey={apiKey}
            streetViewPanoramaOptions={streetViewPanoramaOptions}
        />
    )
}

