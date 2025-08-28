document.addEventListener('DOMContentLoaded', function() {
    // Function to apply theme and accent color
    function applySettings() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedColor = localStorage.getItem('accentColor') || '#ffd700';

        document.documentElement.setAttribute('data-theme', savedTheme);
        document.documentElement.style.setProperty('--accent-primary', savedColor);

        // Update logo filter based on theme
        const logoFilter = savedTheme === 'light' ? 'invert(0%) grayscale(100%) brightness(0%)' : 'none';
        document.documentElement.style.setProperty('--logo-filter-light', logoFilter);

        // Update the quick settings panel if it exists on the page
        const themeToggleSwitch = document.querySelector('.settings-panel #theme-toggle .toggle-switch');
        if (themeToggleSwitch) {
            if (savedTheme === 'light') {
                themeToggleSwitch.classList.add('active');
            } else {
                themeToggleSwitch.classList.remove('active');
            }
        }

        // Update the main settings page theme toggle if it exists
        const mainThemeToggle = document.getElementById('themeToggle');
        if (mainThemeToggle) {
            if (savedTheme === 'light') {
                mainThemeToggle.classList.add('active');
            } else {
                mainThemeToggle.classList.remove('active');
            }
        }

        // Apply reduced motion setting
        const savedReducedMotion = localStorage.getItem('reducedMotion');
        if (savedReducedMotion === 'true') {
            document.documentElement.classList.add('no-animations');
            const reducedMotionToggle = document.querySelector('#appearance .setting-item .toggle-switch:nth-of-type(2)');
            if (reducedMotionToggle) {
                reducedMotionToggle.classList.add('active');
            }
        } else {
            document.documentElement.classList.remove('no-animations');
            const reducedMotionToggle = document.querySelector('#appearance .setting-item .toggle-switch:nth-of-type(2)');
            if (reducedMotionToggle) {
                reducedMotionToggle.classList.remove('active');
            }
        }

        // Update the main settings page accent color picker and presets
        const accentColorInput = document.getElementById('accentColor');
        if (accentColorInput) {
            accentColorInput.value = savedColor;
            document.querySelectorAll('.preset-color').forEach(c => c.classList.remove('active'));
            const activeColorPreset = document.querySelector(`.preset-color[data-color="${savedColor}"]`);
            if (activeColorPreset) {
                activeColorPreset.classList.add('active');
            }
        }
    }

    // Apply settings on page load
    applySettings();

    // Event listeners for settings changes (only relevant for settings.html or universal panel)
    const settingsPanel = document.querySelector('.settings-panel');
    const mainSettingsContent = document.querySelector('.settings-content');

    if (settingsPanel) {
        const themeToggleSwitch = settingsPanel.querySelector('#theme-toggle .toggle-switch');
        if (themeToggleSwitch) {
            themeToggleSwitch.addEventListener('click', function() {
                this.classList.toggle('active');
                const isLight = this.classList.contains('active');
                const newTheme = isLight ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);
                
                // Update logo filter
                const logoFilter = isLight ? 'invert(0%) grayscale(100%) brightness(0%)' : 'none';
                document.documentElement.style.setProperty('--logo-filter-light', logoFilter);

                // Also update the main settings page toggle if it exists
                const mainThemeToggle = document.getElementById('themeToggle');
                if (mainThemeToggle) {
                    if (isLight) {
                        mainThemeToggle.classList.add('active');
                    } else {
                        mainThemeToggle.classList.remove('active');
                    }
                }
            });
        }
    }

    if (mainSettingsContent) {
        const mainThemeToggle = document.getElementById('themeToggle');
        if (mainThemeToggle) {
            mainThemeToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                const isLight = this.classList.contains('active');
                const newTheme = isLight ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);

                // Update logo filter
                const logoFilter = isLight ? 'invert(0%) grayscale(100%) brightness(0%)' : 'none';
                document.documentElement.style.setProperty('--logo-filter-light', logoFilter);
                
                // Also update the quick settings panel toggle if it exists
                const themeToggleSwitch = document.querySelector('.settings-panel #theme-toggle .toggle-switch');
                if (themeToggleSwitch) {
                    if (isLight) {
                        themeToggleSwitch.classList.add('active');
                    } else {
                        themeToggleSwitch.classList.remove('active');
                    }
                }
            });
        }

        // Reduced Motion Toggle
        const reducedMotionToggle = document.querySelector('#appearance .setting-item .toggle-switch:nth-of-type(2)');
        if (reducedMotionToggle) {
            reducedMotionToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                const isReduced = this.classList.contains('active');
                localStorage.setItem('reducedMotion', isReduced);
                if (isReduced) {
                    document.documentElement.classList.add('no-animations');
                } else {
                    document.documentElement.classList.remove('no-animations');
                }
            });
        }

        const accentColorInput = document.getElementById('accentColor');
        if (accentColorInput) {
            accentColorInput.addEventListener('input', function() {
                const colorValue = this.value;
                localStorage.setItem('accentColor', colorValue);
                document.documentElement.style.setProperty('--accent-primary', colorValue);
                document.querySelectorAll('.preset-color').forEach(c => c.classList.remove('active'));
            });
        }

        const presetColors = document.querySelectorAll('.preset-color');
        presetColors.forEach(color => {
            color.addEventListener('click', function() {
                presetColors.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const colorValue = this.getAttribute('data-color');
                document.getElementById('accentColor').value = colorValue;
                localStorage.setItem('accentColor', colorValue);
                document.documentElement.style.setProperty('--accent-primary', colorValue);
            });
        });
    }

    // Universal settings button functionality
    const settingsToggleBtn = document.querySelector('.settings-toggle');
    const settingsPanelDiv = document.querySelector('.settings-panel');
    const settingsCloseBtn = document.querySelector('.settings-close');

    if (settingsToggleBtn && settingsPanelDiv && settingsCloseBtn) {
        settingsToggleBtn.addEventListener('click', () => {
            settingsPanelDiv.classList.toggle('open');
        });

        settingsCloseBtn.addEventListener('click', () => {
            settingsPanelDiv.classList.remove('open');
        });
    }
});
