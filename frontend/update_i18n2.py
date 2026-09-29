import json, re

keys = [
    'Module not found.',
    'Screening Finding',
    'Modality Signal',
    'Combined Motor-Pattern Score',
    'Assessment Coverage',
    'Assigned Task',
    'Data Capture',
    'Camera preview',
    'Reading Prompt',
    'Cognitive Reaction Time Assessment',
    'When the screen turns green, click or tap anywhere inside the box as quickly as possible to measure your psychomotor response latency.',
    'Ready to begin',
    'Wait for Green...',
    'You must wait for the green screen.',
    'Reaction latency recorded.',
    'Mobile data received successfully!',
    'Workspace'
]

translations = {
    'es': {
        'Module not found.': 'Módulo no encontrado.',
        'Screening Finding': 'Hallazgo de cribado',
        'Modality Signal': 'Señal de modalidad',
        'Combined Motor-Pattern Score': 'Puntuación combinada del patrón motor',
        'Assessment Coverage': 'Cobertura de evaluación',
        'Assigned Task': 'Tarea asignada',
        'Data Capture': 'Captura de datos',
        'Camera preview': 'Vista previa de cámara',
        'Reading Prompt': 'Indicación de lectura',
        'Cognitive Reaction Time Assessment': 'Evaluación del tiempo de reacción cognitiva',
        'When the screen turns green, click or tap anywhere inside the box as quickly as possible to measure your psychomotor response latency.': 'Cuando la pantalla se vuelva verde, haga clic o toque en cualquier parte de la caja lo más rápido posible para medir la latencia de su respuesta psicomotora.',
        'Ready to begin': 'Listo para comenzar',
        'Wait for Green...': 'Espera al verde...',
        'You must wait for the green screen.': 'Debes esperar a la pantalla verde.',
        'Reaction latency recorded.': 'Latencia de reacción registrada.',
        'Mobile data received successfully!': '¡Datos móviles recibidos con éxito!',
        'Workspace': 'Espacio de trabajo'
    },
    'fr': {
        'Module not found.': 'Module introuvable.',
        'Screening Finding': 'Découverte de dépistage',
        'Modality Signal': 'Signal de modalité',
        'Combined Motor-Pattern Score': 'Score combiné du modèle moteur',
        'Assessment Coverage': 'Couverture d\'évaluation',
        'Assigned Task': 'Tâche assignée',
        'Data Capture': 'Capture de données',
        'Camera preview': 'Aperçu de la caméra',
        'Reading Prompt': 'Invite de lecture',
        'Cognitive Reaction Time Assessment': 'Évaluation du temps de réaction cognitive',
        'When the screen turns green, click or tap anywhere inside the box as quickly as possible to measure your psychomotor response latency.': 'Lorsque l\'écran devient vert, cliquez ou appuyez n\'importe où dans la boîte le plus rapidement possible pour mesurer la latence de votre réponse psychomotrice.',
        'Ready to begin': 'Prêt à commencer',
        'Wait for Green...': 'Attendez le vert...',
        'You must wait for the green screen.': 'Vous devez attendre l\'écran vert.',
        'Reaction latency recorded.': 'Latence de réaction enregistrée.',
        'Mobile data received successfully!': 'Données mobiles reçues avec succès !',
        'Workspace': 'Espace de travail'
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
        
        lines = block_content.rstrip().split('\n')
        if not lines[-1].strip().endswith(','):
            lines[-1] = lines[-1] + ','
            
        new_lines = []
        for key in keys:
            if f'\"{key}\":' not in block_content:
                val = key if lang == 'en' else translations[lang][key]
                new_lines.append(f'    \"{key}\": \"{val}\",')
                
        if new_lines:
            new_lines[-1] = new_lines[-1].rstrip(',')
            block_content = '\n'.join(lines) + '\n' + '\n'.join(new_lines) + '\n'
            
        content = content[:match.start()] + block_start + block_content + block_end + content[match.end():]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
