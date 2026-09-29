import json, re

keys = [
    'Prototype behavioral score',
    'High-quality assessment',
    'Compared with previous session',
    'All modalities assessed',
    'Motor Profile Visualization',
    'Current session vs. previous session',
    'Current Session',
    'Previous Session',
    'Personal Baseline',
    'Your current motor profile compared with your previous assessment.',
    'Current profile',
    'baseline deviation',
    'Based on 3 previous sessions',
    'View full history',
    'Sequential',
    'Sessions',
    'Profile',
    'Quality',
    'Modalities',
    'Baseline',
    'View',
    'Input Quality',
    'Profile Score',
    'High quality',
    'Good quality',
    'Assessment Complete',
    'You have successfully completed all 8 motor and behavioral modules. Your data has been securely processed and aggregated.',
    'Module Breakdown'
]

translations = {
    'es': {
        'Prototype behavioral score': 'Puntuación de comportamiento prototipo',
        'High-quality assessment': 'Evaluación de alta calidad',
        'Compared with previous session': 'Comparado con la sesión anterior',
        'All modalities assessed': 'Todas las modalidades evaluadas',
        'Motor Profile Visualization': 'Visualización del perfil motor',
        'Current session vs. previous session': 'Sesión actual vs. sesión anterior',
        'Current Session': 'Sesión actual',
        'Previous Session': 'Sesión anterior',
        'Personal Baseline': 'Línea base personal',
        'Your current motor profile compared with your previous assessment.': 'Su perfil motor actual comparado con su evaluación anterior.',
        'Current profile': 'Perfil actual',
        'baseline deviation': 'desviación de la línea base',
        'Based on 3 previous sessions': 'Basado en 3 sesiones anteriores',
        'View full history': 'Ver historial completo',
        'Sequential': 'Secuencial',
        'Sessions': 'Sesiones',
        'Profile': 'Perfil',
        'Quality': 'Calidad',
        'Modalities': 'Modalidades',
        'Baseline': 'Línea base',
        'View': 'Ver',
        'Input Quality': 'Calidad de entrada',
        'Profile Score': 'Puntuación de perfil',
        'High quality': 'Alta calidad',
        'Good quality': 'Buena calidad',
        'Assessment Complete': 'Evaluación Completa',
        'You have successfully completed all 8 motor and behavioral modules. Your data has been securely processed and aggregated.': 'Ha completado con éxito los 8 módulos motores y de comportamiento. Sus datos han sido procesados y agregados de forma segura.',
        'Module Breakdown': 'Desglose del Módulo'
    },
    'fr': {
        'Prototype behavioral score': 'Score comportemental prototype',
        'High-quality assessment': 'Évaluation de haute qualité',
        'Compared with previous session': 'Comparé à la session précédente',
        'All modalities assessed': 'Toutes les modalités évaluées',
        'Motor Profile Visualization': 'Visualisation du profil moteur',
        'Current session vs. previous session': 'Session actuelle vs. session précédente',
        'Current Session': 'Session actuelle',
        'Previous Session': 'Session précédente',
        'Personal Baseline': 'Base de référence personnelle',
        'Your current motor profile compared with your previous assessment.': 'Votre profil moteur actuel comparé à votre évaluation précédente.',
        'Current profile': 'Profil actuel',
        'baseline deviation': 'écart par rapport à la base',
        'Based on 3 previous sessions': 'Basé sur 3 sessions précédentes',
        'View full history': 'Voir l\'historique complet',
        'Sequential': 'Séquentiel',
        'Sessions': 'Sessions',
        'Profile': 'Profil',
        'Quality': 'Qualité',
        'Modalities': 'Modalités',
        'Baseline': 'Base',
        'View': 'Voir',
        'Input Quality': 'Qualité d\'entrée',
        'Profile Score': 'Score du profil',
        'High quality': 'Haute qualité',
        'Good quality': 'Bonne qualité',
        'Assessment Complete': 'Évaluation Complète',
        'You have successfully completed all 8 motor and behavioral modules. Your data has been securely processed and aggregated.': 'Vous avez terminé avec succès les 8 modules moteurs et comportementaux. Vos données ont été traitées et agrégées en toute sécurité.',
        'Module Breakdown': 'Répartition des Modules'
    }
}

file_path = 'd:/NeuroSense/frontend/src/utils/i18n.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for lang in ['en', 'es', 'fr']:
    # Find the language dictionary block
    pattern = r'(\"' + lang + r'\":\s*\{)(.*?)(^\s*\})'
    match = re.search(pattern, content, flags=re.DOTALL | re.MULTILINE)
    if match:
        block_start = match.group(1)
        block_content = match.group(2)
        block_end = match.group(3)
        
        # Add new keys if not present
        lines = block_content.rstrip().split('\n')
        if lines[-1].strip().endswith(','):
            pass
        else:
            lines[-1] = lines[-1] + ','
            
        new_lines = []
        for key in keys:
            if f'\"{key}\":' not in block_content:
                val = key if lang == 'en' else translations[lang][key]
                new_lines.append(f'    \"{key}\": \"{val}\",')
                
        if new_lines:
            # remove trailing comma from last element
            new_lines[-1] = new_lines[-1].rstrip(',')
            block_content = '\n'.join(lines) + '\n' + '\n'.join(new_lines) + '\n'
            
        content = content[:match.start()] + block_start + block_content + block_end + content[match.end():]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
