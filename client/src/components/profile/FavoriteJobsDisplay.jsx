export default function FavoriteJobsDisplay({profile, isOwnProfile}){
    console.log("Profile from fav jobs ", profile);

    return ( 
        <>   
        {isOwnProfile && (
            <div>
            {profile.user.fav_jobs.length > 0 && (
                <>
                {profile.user.fav_jobs.map((j, index) => (
                    <p key={index}>
                        Job: {j.job_title}
                    </p>
                ))}
                </>
            )}
            {profile.user.fav_jobs.length === 0 && (
                <p>No favorite jobs yet.</p>
            )}
        </div>
        )}
        </>
    )
}