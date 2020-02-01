/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package server;

import auxiliar.ConsolePrinter;
import auxiliar.ServerTemplatesProcessor;
import database.CodegenDatabaseController;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;
import main.NoLogging;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import static server.CodegenServer.PORTA;

/**
 *
 * @author Ivo
 */
public class NewServer implements Runnable {
    
    
    public static final int SERVER_PORT = 9080;
    
    public static final long CONNECTION_TIMEOUT = TimeUnit.MILLISECONDS.convert(2, TimeUnit.MINUTES);
    
    private static boolean status = false;
    private static org.eclipse.jetty.server.Server server;
    public static final boolean RUNNING_FROM_JAR = NewServer.class.getResource("NewServer.class").toString().startsWith("jar:");
    
    
    public static void startServer(){
        if(status) {
            return;
        }
        new Thread(new NewServer()).start();
        
        
    }
    
    @Override
    public void run() {
        try {
            org.eclipse.jetty.util.log.Log.setLog(new NoLogging());
            server = new org.eclipse.jetty.server.Server(SERVER_PORT);
            
            ServletContextHandler ctxHand = new ServletContextHandler(ServletContextHandler.SESSIONS);
            ctxHand.setContextPath("/");
            ctxHand.setServer(server);
            ctxHand.addServlet(new ServletHolder(new NewServlet()), "/");
            
            server.setHandler(ctxHand);
            server.start();
            status = true;
            server.join();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
    
    public static InputStream getResource(String name){
        if(name.contains("..")) return null;
        if(RUNNING_FROM_JAR){
            if(!name.startsWith("/")) name = "/" + name;
            return NewServer.class.getResourceAsStream(name);
        } else {
            try {
                return new FileInputStream(new File(name));
            } catch (FileNotFoundException ex) {
                return null;
            }
        }
    }
    
    public static void main(String[] args) {
        org.eclipse.jetty.util.log.Log.setLog(new NoLogging());
        System.out.println("HW Codegen\n"
                + "  Gerador de fontes da Haftware\n"
                + "  Todos os direitos reservados à Haftware Sistemas ltda.\n");
        ConsolePrinter.printInfo("Inicializando...");
        ConsolePrinter.printInfo("Inicializando o microservidor do Codegen...");
        Server server = new Server(PORTA);
        try{
            CodegenDatabaseController.init();
            //FilesSandBox.init(CodegenGlobalConfig.loadConfig().getGenOutput());
            ServerTemplatesProcessor.init();
            //criaIconeNaTray();
            NewServer.startServer();
        } catch (Exception e){
            ConsolePrinter.printError("Não foi possível inicializar o servidor do Codegen\n"
                    + "    Verifique se a porta " + PORTA + " não está ocupada por outro processo.");
            System.exit(0);
        }
    }
}
