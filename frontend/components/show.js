import slugify from 'react-slugify'
import styles from '../styles/show.module.scss'
import moment from 'moment'
import { toast } from 'react-toastify'
import { fetchWithToken } from './main/auth'
import defaultImg from '../public/default.png'

export default function Show({ show, user, setUser, setNote, setRating, isSingle }) {
  const handleAddFav = async () => {
    if (user) {
      const resp = await fetchWithToken(process.env.apiUrl + `favourites/${user.username}`, {
        method: 'POST',
        body: JSON.stringify({ user_id: user._id, show_id: show.id })
      }).then(res => res.json())
      setUser(resp)
      toast.success(`Successfuly added ${show?.name} to your favorites!`)
    }
    else {
      toast.error("Please, log in to add this show to your favorites!")
    }
  }
  const handleRmvFav = async () => {
    if (user) {
    const resp = await fetchWithToken(process.env.apiUrl + `favourites/${user.username}`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: user._id, show_id: show.id })
    }).then(res => res.json())
    setUser(resp)
    isSingle && setNote('')
    isSingle && setRating(0)
    toast.success(`Successfuly removed '${show?.name}' from your favorites!`)
    }
    else{
      toast.error("Unauthorized action!")
    }
  }

  return (
    <div className={styles.Show}>
      <div className={styles.Image_container}>
        <a href={`${isSingle ? "" : "/shows/"}${show && slugify((show?.name).replace(new RegExp(/\'|\./), ""))}`}>
          <img 
            src={show?.image?.medium || defaultImg.src} 
            style={!show?.image?.medium ? {
              width: "100%",
              height: "100%",
              objectFit: "cover"} : {}}
            />
        </a>
      </div>
      <div className={styles.Details_container}>
        <div className={styles.Details}>
          <a href={`${isSingle ? "" : "/shows/"}${show && slugify((show?.name).replace(new RegExp(/\'|\./), ""))}`}>
            {show?.name} | {show && moment(show.premiered).format("YYYY")}{show && show.ended ? ` - ${show && moment(show.ended).format("YYYY")}` : ""}
          </a>
          <p>[{show && show.genres.map((g, index) => `${g}${show && show.genres[index + 1] ? ', ' : ''}`)}] | Average episode runtime: {show && show.averageRuntime} mins.</p>
          <span dangerouslySetInnerHTML={{ __html: show && show.summary }} />
        </div>
        <div className={styles.Actions}>
          <a href={show && show.url} target={'_blank'}>View official site</a>
          {
            !user ?
              /* not logged in */
              <button
                className={styles.Add}
                onClick={handleAddFav}
              >Add to Favorites
              </button>
              :
              /* logged in.. check if show is in favs */
              user && show && user?.fav_shows.filter(el => el.show_id === show.id).length !== 0 ?
                <button
                  className={styles.Rmv}
                  onClick={() => handleRmvFav(show)}
                >Remove from Favorites
                </button>
                :
                <button
                  className={styles.Add}
                  onClick={handleAddFav}
                >Add to Favorites
                </button>
          }
        </div>
      </div>
    </div>
  )
}
