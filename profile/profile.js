document.getElementById('view-profile-btn').addEventListener('click', function() {
    document.getElementById('profile-details').style.display = 'block';
    document.getElementById('profile-section-id').style.display = 'none';
    document.getElementById('heading').style.display = 'none';
    document.getElementById('trips-section').style.display = 'none';
    document.getElementById('itenary-section').style.display = 'none';
});

document.getElementById('my-trips-btn').addEventListener('click', function() {
    document.getElementById('trips-section').style.display = 'block';
    document.getElementById('profile-details').style.display = 'none';
    document.getElementById('profile-section-id').style.display = 'none';
    document.getElementById('heading').style.display = 'none';
    document.getElementById('itenary-section').style.display = 'none';
});

document.getElementById('save-profile-btn').addEventListener('click', function() {
    alert('Profile details saved successfully!');
    const name = document.getElementById('profile-name').value;
    const Welcome = 'Welcome,' ;
    document.querySelector('.page-heading').textContent = Welcome+name;
});

document.getElementById('back-to-main-btn-p').addEventListener('click', function() {
    document.getElementById('profile-details').style.display = 'none';
    document.getElementById('profile-section-id').style.display = 'block';
    document.getElementById('heading').style.display = 'block';
    document.getElementById('trips-section').style.display = 'none';
    document.getElementById('itenary-section').style.display = 'none';
});

document.getElementById('back-to-main-btn-t').addEventListener('click', function() {
    document.getElementById('profile-details').style.display = 'none';
    document.getElementById('profile-section-id').style.display = 'block';
    document.getElementById('heading').style.display = 'block';
    document.getElementById('trips-section').style.display = 'none';
    document.getElementById('itenary-section').style.display = 'none';
});

document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const tab = this.getAttribute('data-tab');
        document.getElementById(tab).classList.add('active');
        this.classList.add('active');
    });
});

document.querySelector('.trip-details').addEventListener('click',function(){
    document.getElementById('profile-details').style.display = 'none';
    document.getElementById('profile-section-id').style.display = 'none';
    document.getElementById('heading').style.display = 'none';
    document.getElementById('trips-section').style.display = 'none';
    document.getElementById('itenary-section').style.display = 'block';
});

document.getElementById('back-to-main-btn-itenary').addEventListener('click', function() {
    document.getElementById('profile-details').style.display = 'none';
    document.getElementById('profile-section-id').style.display = 'block';
    document.getElementById('heading').style.display = 'block';
    document.getElementById('trips-section').style.display = 'none';
    document.getElementById('itenary-section').style.display = 'none';
});