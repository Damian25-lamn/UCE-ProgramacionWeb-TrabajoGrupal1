import sun.jvmstat.monitor.MonitoredVmUtil.mainClass

plugins {
    id("java")
    id("application")
    id("io.freefair.lombok") version "9.5.0"
}

group = "com.programacion.web"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

// Definimos la versión de Helidon SE de forma centralizada
val helidonVersion = "4.5.0"

dependencies {
    // 1. Servidor Web y Enrutamiento
    implementation("io.helidon.webserver:helidon-webserver:$helidonVersion")

    // 2. Media JSON-B para parsear y responder JSON
    implementation("io.helidon.http.media:helidon-http-media-jsonb:$helidonVersion")

    // 3. Cliente de Base de Datos (DbClient Core, JDBC y Pool Hikari)
    implementation("io.helidon.dbclient:helidon-dbclient:$helidonVersion")
    implementation("io.helidon.dbclient:helidon-dbclient-jdbc:$helidonVersion")
    implementation("io.helidon.dbclient:helidon-dbclient-hikari:$helidonVersion")

    // 4. Configuración externa YAML (Runtime)
    implementation("io.helidon.config:helidon-config-yaml:$helidonVersion")

    // 5. Driver de Base de Datos PostgreSQL
    implementation("org.postgresql:postgresql:42.7.11")

    // 6. Logger simple para SLF4J (Evita advertencias en consola)
    implementation("org.slf4j:slf4j-simple:2.0.12")
}

application {
    // Definimos la clase principal que contendrá el punto de entrada único (public static void main)
    mainClass.set("com.programacion.web.Main")
}

tasks.withType<JavaCompile> {
    options.release.set(21)
}

sourceSets {
    main {
        output.setResourcesDir(file("${layout.buildDirectory.get()}/classes/java/main"))
    }
}