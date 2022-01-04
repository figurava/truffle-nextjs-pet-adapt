import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'

import React, { useState, useEffect } from 'react'
import web3Actions from './web3Actions'

export default class Home extends React.Component {

   constructor(props) {
    super(props);
    this.state = { pets: [], adopters: [] };
  }

  componentDidMount() {
    // initialize web3
    web3Actions.initWeb3((state) => { this.setState(state)});
    // fetch pets repostitory
    axios.get('/api/pets').then((response)=> {
      this.setState({pets: response.data});
    });
  }

  isEmptyAddress(address) {
    return /^0x0+$/.test(address);
  }

  adapt(petId ) {
    web3Actions.handleAdopt(petId)
  }

  render() {
    const { pets, adopters} = this.state;
    const adapteds = adopters.filter((item) => !this.isEmptyAddress(item));

    return (<div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold my-5 text-center">Pet Adapt</h1>
      <h1 className="text-2xl font-bold mt-5 text-center">
        { adapteds.length } of { adopters.length } pets adapted
      </h1>

      <div className="grid grid-cols-4 gap-5 text-center mt-4 mb-10">
        {pets ? pets.map((pet) => {
          return (
            <div className="flex flex-col shadow p-2" key={pet.id}>
              <img src={`https://placedog.net/300/200/${pet.id + 10}`} className="w-full" />
              <div className="my-2">
                {pet.name} <br />
                {pet.age} years old
              </div>

              {this.isEmptyAddress(adopters[pet.id]) ?
                <button onClick={(e)=>{ this.adapt(pet.id) }} className="bg-sky-300 hover:bg-sky-400 rounded py-2">Adapt Now #{pet.id} </button> :
                <span className="py-2">Has an owner</span>
              }

            </div>
          );
        }) : null}
      </div>

      </div>
    )};
}