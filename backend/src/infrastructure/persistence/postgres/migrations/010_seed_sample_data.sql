-- Sample seed data — replace with real data later

-- Sample user (password: 123456, bcrypt-hashed)
INSERT INTO users (id, username, email, password) VALUES
  ('user-uuid-1', 'Ana Developer', 'ana@test.com', '$2b$10$SAMPLE_HASH_REPLACE_ME')
ON CONFLICT (id) DO NOTHING;

-- Wallet for sample user
INSERT INTO wallets (user_id, balance) VALUES
  ('user-uuid-1', 500)
ON CONFLICT (user_id) DO NOTHING;

-- Sample volumes
INSERT INTO volumes (id, title, description, categories, price, thumbnail) VALUES
  ('01', 'Historia de la IA',
   'Desde los tiempos más remotos se soñaba con algo que pudiera imitar nuestra capacidad de aprendizaje y de resolución de problemas. ¿Cómo se imaginaban los antiguos la Inteligencia Artificial? ¿Cómo llego la IA a ser lo que es ahora? Resuelve estás questiones ahora navegando a traves de la historia de la IA.',
   ARRAY['Historia', 'Tecnología'], 50,
   'https://res.cloudinary.com/dzbllqpfj/image/upload/v1771513999/TheIAStory_uwpe9v.png')
ON CONFLICT (id) DO NOTHING;

-- User-volume ownership
INSERT INTO user_volumes (user_id, volume_id) VALUES
  ('user-uuid-1', '01')
ON CONFLICT DO NOTHING;

-- Chapters for volume 01
INSERT INTO chapters (id, volume_id, title, type, content_url) VALUES
  ('ch-01', '01', 'El sueño antiguo de crear inteligencia', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771680165/IAstory-Chapter1_y3ongr.mp4'),
  ('ch-02', '01', 'El nacimiento oficial de la IA', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771680264/IAStory-chaper2_cwanhr.mp4'),
  ('ch-03', '01', 'Los primeros logros y la ilusión del éxito', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771680307/IAStory-chaper3_vofmet.mp4'),
  ('ch-04', '01', 'Los inviernos de la IA', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771680341/IAStory-chaper4_pqgmzw.mp4'),
  ('ch-05', '01', 'Aprender del mundo: Machine Learning', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771514279/IAStory-chaper5_bycfyx.mp4'),
  ('ch-06', '01', 'Deep Learning y la IA actual', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771514292/IAStory-chaper6_pylxbc.mp4')
ON CONFLICT (id) DO NOTHING;

-- User progress
INSERT INTO user_progress (user_id, chapter_id, is_completed) VALUES
  ('user-uuid-1', 'ch-01', TRUE),
  ('user-uuid-1', 'ch-02', TRUE)
ON CONFLICT DO NOTHING;

-- Volume starts
INSERT INTO volume_starts (user_id, volume_id) VALUES
  ('user-uuid-1', '01')
ON CONFLICT DO NOTHING;

-- Pruebas (questions stored as JSONB)
INSERT INTO pruebas (id, volume_id, chapter_id, questions) VALUES
  ('01', '01', 'ch-01', '[
    {"id":"q_01","question":"¿Por qué el deseo de crear inteligencia artificial existe desde antes de las computadoras?","options":[{"id":"a","text":"Porque los humanos siempre han tenido tecnología avanzada"},{"id":"b","text":"Porque la inteligencia se percibe como algo mágico"},{"id":"c","text":"Porque el ser humano busca comprender y replicar su propia mente"},{"id":"d","text":"Porque las máquinas siempre han sido parte de la sociedad"}],"correctOptionIds":["c"]},
    {"id":"q_02","question":"¿Qué representan los autómatas y golems en relación con la IA moderna?","options":[{"id":"a","text":"Máquinas primitivas funcionales"},{"id":"b","text":"Intentos reales de crear vida artificial"},{"id":"c","text":"Mitos sin relación con la tecnología"},{"id":"d","text":"Proyecciones tempranas del deseo humano de crear inteligencia"}],"correctOptionIds":["d"]},
    {"id":"q_03","question":"¿Qué hace disruptiva la pregunta de Alan Turing?","options":[{"id":"a","text":"Que afirma que las máquinas son superiores a los humanos"},{"id":"b","text":"Que evita la filosofía y propone un criterio práctico"},{"id":"c","text":"Que define claramente qué es pensar"},{"id":"d","text":"Que demuestra que las máquinas tienen conciencia"}],"correctOptionIds":["b"]},
    {"id":"q_04","question":"¿Qué objetivo tenía el Test de Turing?","options":[{"id":"a","text":"Medir la velocidad de cálculo de una máquina"},{"id":"b","text":"Determinar si una máquina tiene emociones"},{"id":"c","text":"Evaluar si una máquina puede imitar el comportamiento lingüístico humano"},{"id":"d","text":"Probar si una máquina es consciente"}],"correctOptionIds":["c"]},
    {"id":"q_05","question":"¿Qué revela este módulo sobre la naturaleza humana?","options":[{"id":"a","text":"Que el ser humano teme a la inteligencia"},{"id":"b","text":"Que la inteligencia es exclusiva del cerebro"},{"id":"c","text":"Que existe un deseo profundo de comprenderse a sí mismo"},{"id":"d","text":"Que la tecnología reemplazará a la humanidad"}],"correctOptionIds":["c"]}
  ]'),
  ('02', '01', 'ch-02', '[
    {"id":"q_01","question":"¿Por qué la conferencia de Dartmouth es clave en la historia de la IA?","options":[{"id":"a","text":"Porque se creó la primera computadora"},{"id":"b","text":"Porque se demostró la inteligencia artificial"},{"id":"c","text":"Porque se acuñó el término Inteligencia Artificial"},{"id":"d","text":"Porque se resolvió el problema del lenguaje"}],"correctOptionIds":["c"]},
    {"id":"q_02","question":"¿Cuál era la actitud predominante de los primeros investigadores?","options":[{"id":"a","text":"Escepticismo"},{"id":"b","text":"Prudencia"},{"id":"c","text":"Pesimismo"},{"id":"d","text":"Optimismo extremo"}],"correctOptionIds":["d"]},
    {"id":"q_03","question":"¿Qué error principal cometieron los pioneros de la IA?","options":[{"id":"a","text":"Usar computadoras lentas"},{"id":"b","text":"No definir inteligencia"},{"id":"c","text":"Subestimar la complejidad de la mente humana"},{"id":"d","text":"No contar con datos"}],"correctOptionIds":["c"]},
    {"id":"q_04","question":"¿Por qué el optimismo inicial fue peligroso?","options":[{"id":"a","text":"Porque detuvo la investigación"},{"id":"b","text":"Porque generó expectativas irreales"},{"id":"c","text":"Porque eliminó la competencia"},{"id":"d","text":"Porque limitó el desarrollo académico"}],"correctOptionIds":["b"]},
    {"id":"q_05","question":"¿Qué función cumplió ese optimismo pese a sus errores?","options":[{"id":"a","text":"Atrasar la IA"},{"id":"b","text":"Justificar el abandono del campo"},{"id":"c","text":"Impulsar la investigación inicial"},{"id":"d","text":"Eliminar el debate ético"}],"correctOptionIds":["c"]}
  ]'),
  ('03', '01', 'ch-03', '[
    {"id":"q_01","question":"¿Por qué ELIZA generó vínculos emocionales con los usuarios?","options":[{"id":"a","text":"Porque entendía emociones humanas"},{"id":"b","text":"Porque tenía conciencia"},{"id":"c","text":"Porque las personas proyectaban significado en sus respuestas"},{"id":"d","text":"Porque era un sistema avanzado de IA general"}],"correctOptionIds":["c"]},
    {"id":"q_02","question":"¿Qué diferencia hay entre simular comprensión y comprender?","options":[{"id":"a","text":"No existe ninguna diferencia"},{"id":"b","text":"La simulación implica intención"},{"id":"c","text":"La comprensión real implica significado y contexto"},{"id":"d","text":"La simulación es más avanzada"}],"correctOptionIds":["c"]},
    {"id":"q_03","question":"¿Qué provocaron los primeros éxitos de la IA?","options":[{"id":"a","text":"Un avance definitivo"},{"id":"b","text":"Una percepción exagerada de progreso"},{"id":"c","text":"El fin de la investigación"},{"id":"d","text":"El rechazo social"}],"correctOptionIds":["b"]},
    {"id":"q_04","question":"¿Qué papel juega el ser humano en la percepción de inteligencia?","options":[{"id":"a","text":"Ninguno"},{"id":"b","text":"Solo interpreta resultados técnicos"},{"id":"c","text":"Proyecta emociones e intenciones"},{"id":"d","text":"Impide el desarrollo de la IA"}],"correctOptionIds":["c"]},
    {"id":"q_05","question":"¿Qué advertencia deja este módulo?","options":[{"id":"a","text":"La IA es peligrosa"},{"id":"b","text":"Las máquinas nunca funcionarán"},{"id":"c","text":"Podemos confundir apariencia con inteligencia"},{"id":"d","text":"La tecnología es neutral"}],"correctOptionIds":["c"]}
  ]'),
  ('04', '01', 'ch-04', '[
    {"id":"q_01","question":"¿Qué fueron los inviernos de la IA?","options":[{"id":"a","text":"Fallos técnicos temporales"},{"id":"b","text":"Periodos de abandono y falta de financiación"},{"id":"c","text":"Crisis energéticas"},{"id":"d","text":"Cambios de paradigma exitosos"}],"correctOptionIds":["b"]},
    {"id":"q_02","question":"¿Por qué los sistemas no escalaron al mundo real?","options":[{"id":"a","text":"Por falta de interés humano"},{"id":"b","text":"Porque el mundo real es demasiado complejo"},{"id":"c","text":"Por errores matemáticos"},{"id":"d","text":"Por falta de computadoras personales"}],"correctOptionIds":["b"]},
    {"id":"q_03","question":"¿Qué consecuencia tuvo la retirada de fondos?","options":[{"id":"a","text":"Mayor innovación"},{"id":"b","text":"Fin definitivo de la IA"},{"id":"c","text":"Reducción drástica de investigación"},{"id":"d","text":"Mejora en los modelos"}],"correctOptionIds":["c"]},
    {"id":"q_04","question":"¿Qué valor tuvo el trabajo silencioso durante este periodo?","options":[{"id":"a","text":"Ninguno"},{"id":"b","text":"Permitió avances teóricos importantes"},{"id":"c","text":"Eliminó errores previos"},{"id":"d","text":"Detuvo el progreso"}],"correctOptionIds":["b"]},
    {"id":"q_05","question":"¿Qué enseñanza deja este módulo?","options":[{"id":"a","text":"La IA fue un error"},{"id":"b","text":"El progreso científico no es lineal"},{"id":"c","text":"La tecnología avanza sola"},{"id":"d","text":"La financiación no importa"}],"correctOptionIds":["b"]}
  ]'),
  ('05', '01', 'ch-05', '[
    {"id":"q_01","question":"¿Qué cambio introduce el Machine Learning?","options":[{"id":"a","text":"Más reglas"},{"id":"b","text":"Más hardware"},{"id":"c","text":"Aprendizaje a partir de datos"},{"id":"d","text":"Conciencia artificial"}],"correctOptionIds":["c"]},
    {"id":"q_02","question":"¿Por qué este enfoque fue un punto de inflexión?","options":[{"id":"a","text":"Porque elimina errores"},{"id":"b","text":"Porque permite adaptarse al mundo real"},{"id":"c","text":"Porque reduce costos"},{"id":"d","text":"Porque imita emociones"}],"correctOptionIds":["b"]},
    {"id":"q_03","question":"¿Qué representa Deep Blue venciendo a Kasparov?","options":[{"id":"a","text":"Conciencia artificial"},{"id":"b","text":"Pensamiento humano"},{"id":"c","text":"Superioridad computacional en tareas específicas"},{"id":"d","text":"Creatividad artificial"}],"correctOptionIds":["c"]},
    {"id":"q_04","question":"¿Por qué calcular no es lo mismo que pensar?","options":[{"id":"a","text":"Porque calcular es más lento"},{"id":"b","text":"Porque pensar no requiere datos"},{"id":"c","text":"Porque el pensamiento implica comprensión y experiencia"},{"id":"d","text":"Porque las máquinas no pueden calcular"}],"correctOptionIds":["c"]},
    {"id":"q_05","question":"¿Qué limitación persiste en este enfoque?","options":[{"id":"a","text":"Falta de velocidad"},{"id":"b","text":"Dependencia de grandes cantidades de datos"},{"id":"c","text":"Falta de hardware"},{"id":"d","text":"Falta de reglas"}],"correctOptionIds":["b"]}
  ]'),
  ('06', '01', 'ch-06', '[
    {"id":"q_01","question":"¿Qué permitió el auge del Deep Learning?","options":[{"id":"a","text":"Filosofía"},{"id":"b","text":"Redes sociales"},{"id":"c","text":"Datos masivos y GPUs"},{"id":"d","text":"Conciencia artificial"}],"correctOptionIds":["c"]},
    {"id":"q_02","question":"¿Por qué la IA actual parece entender?","options":[{"id":"a","text":"Porque es consciente"},{"id":"b","text":"Porque predice patrones complejos"},{"id":"c","text":"Porque piensa como humano"},{"id":"d","text":"Porque tiene emociones"}],"correctOptionIds":["b"]},
    {"id":"q_03","question":"¿Qué significa que la IA sea un espejo estadístico?","options":[{"id":"a","text":"Que copia literalmente a los humanos"},{"id":"b","text":"Que refleja patrones del comportamiento humano"},{"id":"c","text":"Que reemplaza a la humanidad"},{"id":"d","text":"Que es objetiva"}],"correctOptionIds":["b"]},
    {"id":"q_04","question":"¿Qué emoción genera comúnmente la IA conversacional?","options":[{"id":"a","text":"Indiferencia"},{"id":"b","text":"Miedo exclusivamente"},{"id":"c","text":"Asombro y cercanía"},{"id":"d","text":"Rechazo total"}],"correctOptionIds":["c"]},
    {"id":"q_05","question":"¿Por qué el dilema actual es más humano que técnico?","options":[{"id":"a","text":"Porque la tecnología está completa"},{"id":"b","text":"Porque el problema es ético y social"},{"id":"c","text":"Porque no hay avances técnicos"},{"id":"d","text":"Porque la IA es peligrosa"}],"correctOptionIds":["b"]}
  ]')
ON CONFLICT (id) DO NOTHING;
