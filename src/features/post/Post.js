import { Link } from 'react-router-dom';
import styles from './Post.module.css';


export function Post({id, category, title, url, subreddit, author, numComments}) {
    return  (
        <div className={styles.posts}>
            <Link to={`/subreddit/${subreddit}/postpage/${id}`} className={styles.postTitle}><h3>{title}</h3></Link>
            <img src={url} alt={title} className={styles.postImages} />
            <div className={styles.postInfo}>
                <p>Author: {author}</p>
                <p>Comments: {numComments}</p>
            </div>
        </div>
    )
}