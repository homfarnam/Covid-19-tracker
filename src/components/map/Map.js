import React from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import './Map.css'
import {showDataOnMap} from '../../util'

const Map =({countries,casesType,center,zoom})=> {
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution= " &copy <a href='http://osm.org/copyright'> Openstreet Map </a> contributors"
                />
            </LeafletMap>
            {
                // showDataOnMap(countries,casesType)
            }
        </div>
    )
}

export default Map
