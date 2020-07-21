import React from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import './Map.css'

const Map =({center,zoom})=> {
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution= " &copy <a href='http://osm.org/copyright'> Openstreet Map </a> contributors"
                />
            </LeafletMap>
        </div>
    )
}

export default Map
