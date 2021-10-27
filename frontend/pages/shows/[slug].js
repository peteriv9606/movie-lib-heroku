import Head from 'next/head'
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../components/main/layout"
import styles from '../../styles/singleShow.module.scss'
import Show from '../../components/show'
import { fetchWithToken, getUser } from '../../components/main/auth'
import { Rating } from 'react-simple-star-rating'
import { toast } from 'react-toastify'
import useDebounce from '../../components/main/useDebounce'

export default function SingleShow() {
  const router = useRouter()
  const [show, setShow] = useState()
  const [user, setUser] = useState()
  const [rating, setRating] = useState()
  const [note, setNote] = useState()
  const noteDebounced = useDebounce(note, 1000)

  const err_style = {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'inherit',
    fontWeight: '700'
  }

  useEffect(async () => {
    // get show data
    if (router.query.slug) {
      const init_show = await fetch(process.env.apiUrl + `shows/${router.query.slug}`).then(res => res.json())
      setShow(init_show)
    }
  }, [router.query.slug])

  useEffect(async () => {
    if (show) {
      const u = await getUser()
      if (u && !u.message?.includes("credentials")) {
        setUser(u)
        let fav_show = u?.fav_shows?.filter((fav) => fav.show_id == show?.id)[0]
        if (fav_show) {
          setRating(fav_show.rating)
          setNote(fav_show.note)
        }
      }
    }
  }, [show])

  useEffect(async () => {
    if (noteDebounced !== undefined) {
      const fav_show = user?.fav_shows?.filter((fav) => fav.show_id == show?.id)[0]
      console.log(fav_show)
      if(fav_show){
        if (fav_show.note !== note) {
          const resp = await fetchWithToken(process.env.apiUrl + `favourites/${user.username}/note`, {
            method: "POST",
            body: JSON.stringify({ show_id: show.id, note: note })
          }).then(res => res.json())
          resp?.message ? toast.error(resp.message)
          : (toast.success('Changes made to note were successfully saved!'), setUser(resp))
        }
      } else {
        if(note){
          toast.error('Show not in favourites')
        }
      }
    }
  }, [noteDebounced])

  const handleRating = async (value) => {
    if (user) {
      const resp = await fetchWithToken(process.env.apiUrl + `favourites/${user.username}/rate`, {
        method: "POST",
        body: JSON.stringify({ show_id: show.id, rating: value })
      }).then(res => res.json())
      resp?.message ? toast.error(resp.message)
        : (toast.success(
          value !== 0 ?
            `Successfully gave ${show && show?.name} a rating of ${value}!`
            : `Successfully cleared ${show && show?.name}'s rating!`
        ), setRating(value))
    } else {
      toast.error("Please log in to rate")
    }
  }
  console.log("SHOULD BE DISABLED: ", (user ? (user?.fav_shows?.filter((fav) => fav.show_id == show?.id)[0] ? false : true) : true ))

  return (
    <Layout>
      <Head>
        <title>{`M-Lib.${show && show?.status !== 404 ? (" | " + show?.name) : ""}`}</title>
      </Head>
      <div className={styles.Wrapper}>
        <div className={"Shell"}>
          <div className={styles.Inner}>
            {
              show?.status !== 404 ?
                <>
                  <Show
                    show={show}
                    user={user}
                    setUser={setUser}
                    setNote={setNote}
                    setRating={setRating}
                    isSingle={true}
                  />
                  <h1>Your Review</h1>
                  <div className={styles.Rating_wrapper}>
                    <Rating
                      stars={5}
                      size={30}
                      ratingValue={rating}
                      onClick={handleRating}
                    />
                    <button
                      onClick={() => handleRating(0)}
                      disabled={user ? (user?.fav_shows?.filter((fav) => fav.show_id == show?.id)[0] ? false : true) : true}
                    >Clear rating</button>
                  </div>
                  <div className={styles.Note_wrapper}>
                    <textarea
                      onChange={(e) => setNote(e.target.value)}
                      value={note}
                      placeholder={"Your private notes and comments about the movie..."}
                      disabled={user ? (user?.fav_shows?.filter((fav) => fav.show_id == show?.id)[0] ? false : true) : true}
                    />
                  </div>
                </>
                : <h1 style={err_style} >
                  Request to match show: '{router.query.slug}' returned status of {show?.status} - Not found
                </h1>
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}
