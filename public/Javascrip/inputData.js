document.addEventListener('DOMContentLoaded', function() {
    console.log('inputData.js is loaded!');

    const habitsForm = document.getElementById('habitsForm');
    const formResult = document.getElementById('formResponse');
    const rankedHabits = document.getElementById('rankedHabits');

    // Enable Sortable for habit ranking
    if (rankedHabits && window.Sortable) {
        Sortable.create(rankedHabits, { animation: 150 });
    }

    // Form submission logic
    if (habitsForm) {
        habitsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();

            if (!habitsForm.checkValidity()) {
                habitsForm.classList.add('was-validated');
                if (formResult) {
                    formResult.innerHTML = '<div class="alert alert-danger">Please fill all required fields correctly.</div>';
                }
                return;
            }

            // Collect form data 
            const formData = {
                user_name: document.getElementById('userName').value,
                sleep_hours: document.getElementById('sleepHours').value,
                credit_hours: document.getElementById('creditHours').value,
                study_hours: document.getElementById('studyHours').value,
                exercise_hours: document.getElementById('exerciseHours').value,
                screen_time: document.getElementById('screenTime').value,
                habit_ranking: []
            };

            document.querySelectorAll('#rankedHabits li').forEach(li => {
                formData.habit_ranking.push(li.getAttribute('data-habit'));
            });

            if (formResult) {
                formResult.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
            }

            fetch('http://localhost:80/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => {
                if (!res.ok) throw new Error('Submission failed');
                return res.json();
            })
            .then(data => {
                habitsForm.reset();
                habitsForm.classList.remove('was-validated');
                if (formResult) {
                    formResult.innerHTML = '<div class="alert alert-success">Thank you! Your habits data has been submitted successfully.</div>';
                }
            })
            .catch(err => {
                if (formResult) {
                    formResult.innerHTML = '<div class="alert alert-danger">Error: ' + err.message + '</div>';
                }
            });
        });
    }
});