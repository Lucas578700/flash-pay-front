export default function ProfileImageComponent({ image = null }) {
    let src = '';

    if (image) {
        src = image;
    } else {
        src = '/src/assets/images/profile_not_found.jpg';
    }

    return (
        <div>
            <img width={150} height={150} src={src} alt="Profile" />
        </div>
    );
}
