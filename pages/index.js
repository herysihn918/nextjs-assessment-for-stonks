import Head from 'next/head'
import { useState } from 'react'

const EventCard = ({ name, description, hero_url, starts_at, ends_at, panelists = [], ...eventInfo }) => (
    <div className="text-sm bg-white rounded-lg border hover:border hover:border-gray-400 hover:shadow-md transition-all mb-5" style={{maxHeight: 240}}>
      <div className="flex flex-col justify-between p-0">
        <div className="flex justify-between p-4">
          <div className="flex flex-col">
            <div className="flex">
              <div className="text-xs">
                {/* May 11th 10:00am PDT */}
                {new Date(starts_at).toLocaleString()} - {new Date(ends_at).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="flex items-center pt-2 font-bold text-md whitespace">
                <div>{name}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4">
          <div className="relative mt-1 mb-4 text-xs text-gray-500">
              {description.length > 200 ? description.substring(0, 198) + " ...": description}
          </div>
          {panelists.length > 0 ? ( 
            <div className="pt-1 pb-6">
              <div className="inline-flex items-center">
                <div className='flex'>
                  {panelists.map((ele, key) => (
                    <img className='mr-3' key={`panelist-${key}`} src={ele.avatar_url} width={64} height={64} style={{objectFit: 'cover', borderRadius: 32}} alt={ele.name} onClick={() =>  window.open(ele.twitter_url ? ele.twitter_url : ele.linkedin_url, '_blank')} />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
)

const Home = ({ events = [] }) => {
  const [ investment, setInvestment ] = useState(null)
  const createInterests = () => {
    let interests = []
    events.forEach(evt => {
      evt.investment_interests.forEach(inv => {
        if (interests.filter(ele => ele.id === inv.id).length === 0) {
          interests.push(inv)
        }
      })
    })
    return interests
  }
  return (
    <>
      <Head>
        <title>Stonks Events</title>
      </Head>
      <div className='flex mt-3'>
        <div className=' p-3 pr-10'>
          <div className='font-bold text-md mb-4' style={{minWidth: 240}}>
            Investment Interests
          </div>
          {createInterests().map((inv, key) => (
            <div className={`p-1 ${investment === inv.id ? 'text-white bg-gray-500' : ''}`} key={`invest-${key}`} style={ {cursor: 'pointer'} } onClick={() => setInvestment(prev => prev === inv.id ? null : inv.id)}>{inv.icon} {inv.text}</div>
          ))}
        </div>
        <div className="w-full py-8">
          <div className='grid grid-cols-3 gap-4'>
            {events.filter(evt => evt.investment_interests.filter(inv => (inv.id === investment || investment === null)).length !== 0).map((evt, key) => <EventCard key={key} {...evt} />)}
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const res = await fetch('https://api.stonks.com/principal/event?status=upcoming&perPage=25&orderBy=starts_at,ASC')
  const jsonData = await res.json()
  return {
    props: {
      events: jsonData.data
    }
  }
}

export default Home