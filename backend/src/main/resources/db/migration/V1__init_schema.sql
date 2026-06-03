-- ============================================================
-- VSM Platform — Database Schema (Flyway V1)
-- PostgreSQL with JSONB for flexible process data
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ---- Users ----
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(320) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255),
    role        VARCHAR(20)  NOT NULL DEFAULT 'EDITOR'
                CHECK (role IN ('ADMIN','EDITOR','VIEWER')),
    avatar_url  VARCHAR(512),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- Projects ----
CREATE TABLE vsm_projects (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    product     VARCHAR(100),
    owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_owner ON vsm_projects(owner_id);
CREATE INDEX idx_projects_name  ON vsm_projects USING gin(name gin_trgm_ops);

-- ---- Diagrams ----
CREATE TABLE vsm_diagrams (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id            UUID NOT NULL REFERENCES vsm_projects(id) ON DELETE CASCADE,
    name                  VARCHAR(255) NOT NULL,
    type                  VARCHAR(30)  NOT NULL CHECK (type IN ('CURRENT_STATE','FUTURE_STATE')),
    viewport              JSONB        NOT NULL DEFAULT '{"x":0,"y":0,"zoom":1}',
    takt_time             DOUBLE PRECISION,
    customer_demand       INTEGER,
    working_time_seconds  INTEGER,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_diagrams_project ON vsm_diagrams(project_id);

-- ---- Nodes ----
CREATE TABLE vsm_nodes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id  UUID NOT NULL REFERENCES vsm_diagrams(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,
    label       VARCHAR(255) NOT NULL,
    pos_x       DOUBLE PRECISION NOT NULL DEFAULT 0,
    pos_y       DOUBLE PRECISION NOT NULL DEFAULT 0,
    width       INTEGER NOT NULL DEFAULT 120,
    height      INTEGER NOT NULL DEFAULT 80,
    process_data JSONB,
    properties  JSONB NOT NULL DEFAULT '{}',
    is_3d_visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_nodes_diagram ON vsm_nodes(diagram_id);
CREATE INDEX idx_nodes_type    ON vsm_nodes(type);

-- JSONB index for fast process_data queries
CREATE INDEX idx_nodes_process_data ON vsm_nodes USING gin(process_data);

-- ---- Edges ----
CREATE TABLE vsm_edges (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id  UUID NOT NULL REFERENCES vsm_diagrams(id) ON DELETE CASCADE,
    source_id   UUID NOT NULL REFERENCES vsm_nodes(id) ON DELETE CASCADE,
    target_id   UUID NOT NULL REFERENCES vsm_nodes(id) ON DELETE CASCADE,
    edge_type   VARCHAR(30) NOT NULL DEFAULT 'pushFlow',
    animated    BOOLEAN NOT NULL DEFAULT FALSE,
    label       VARCHAR(255),
    properties  JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_edges_diagram ON vsm_edges(diagram_id);
CREATE INDEX idx_edges_source  ON vsm_edges(source_id);
CREATE INDEX idx_edges_target  ON vsm_edges(target_id);

-- ---- KPI Results ----
CREATE TABLE kpi_results (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id               UUID NOT NULL REFERENCES vsm_diagrams(id) ON DELETE CASCADE,
    computed_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lead_time                DOUBLE PRECISION,
    total_cycle_time         DOUBLE PRECISION,
    value_added_time         DOUBLE PRECISION,
    non_value_added_time     DOUBLE PRECISION,
    process_cycle_efficiency DOUBLE PRECISION,
    takt_time                DOUBLE PRECISION,
    total_wip                INTEGER,
    bottleneck_node_id       UUID REFERENCES vsm_nodes(id) ON DELETE SET NULL,
    process_details          JSONB
);

CREATE INDEX idx_kpi_diagram     ON kpi_results(diagram_id);
CREATE INDEX idx_kpi_computed_at ON kpi_results(computed_at DESC);

-- ---- Simulation Runs ----
CREATE TABLE simulation_runs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id  UUID NOT NULL REFERENCES vsm_diagrams(id) ON DELETE CASCADE,
    status      VARCHAR(20) NOT NULL DEFAULT 'IDLE'
                CHECK (status IN ('IDLE','RUNNING','PAUSED','COMPLETED','ERROR')),
    config      JSONB NOT NULL DEFAULT '{}',
    results     JSONB,
    started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at    TIMESTAMPTZ,
    duration_ms BIGINT
);

CREATE INDEX idx_sim_diagram ON simulation_runs(diagram_id);
CREATE INDEX idx_sim_status  ON simulation_runs(status);

-- ---- Project Collaborators ----
CREATE TABLE project_collaborators (
    project_id  UUID NOT NULL REFERENCES vsm_projects(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL DEFAULT 'VIEWER',
    invited_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- ---- Auto-update updated_at ----
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON vsm_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_diagrams_updated_at
    BEFORE UPDATE ON vsm_diagrams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();