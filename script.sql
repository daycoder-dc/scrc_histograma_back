CREATE INDEX idx_historico_performance
ON historico (fecha ASC, hora ASC)
WHERE eliminado = false
and fecha IS NOT NULL
AND tipo_brigada IS NOT NULL;

CREATE INDEX idx_maestro_lookup
ON maestro (zona, accion);
