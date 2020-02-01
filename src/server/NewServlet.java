/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package server;

import auxiliar.ConsolePrinter;
import auxiliar.FileChooser;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import database.CodegenDatabaseController;
import database.Project;
import database.ProjectSpecs;
import database.TemplateSpecs;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.ServerModel;
import org.eclipse.jetty.server.Request;
import org.json.JSONArray;
import org.json.JSONObject;
import proccessor.ProccessSpecs;
import proccessor.ProccessorCore;

/**
 *
 * @author Ivo
 */
public class NewServlet extends HttpServlet{
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doMethod(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doMethod(req, resp);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.addHeader("Access-Control-Allow-Credentials", "true");
        if(!NewServer.RUNNING_FROM_JAR) resp.addHeader("Access-Control-Allow-Origin", req.getHeader("Origin"));
        resp.addHeader("Access-Control-Allow-Headers", "Content-Type, jsessionid");
        resp.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    }
    
    
    private void doMethod(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.addHeader("Access-Control-Allow-Credentials", "true");
        if(!NewServer.RUNNING_FROM_JAR) resp.addHeader("Access-Control-Allow-Origin", req.getHeader("Origin"));
        resp.addHeader("Access-Control-Allow-Headers", "Content-Type, jsessionid");
        resp.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        try{
            String fullPath = req.getServletPath();
            if(!fullPath.startsWith("/"))fullPath = "/" + fullPath;
            if(fullPath.equals("/") || fullPath.equals("/index.html")) fullPath = "/static/index.html";
            String masterPath = fullPath.split("/")[1];
            if(!masterPath.equals("static") && !fullPath.endsWith("/"))fullPath += "/";
            switch(masterPath){
                case "api":
                    supplyApi(req.getMethod()+" "+fullPath.split("/", 3)[2], req, resp);
                    break;
                case "static":
                    supplyStatic(fullPath.split("/", 3)[2], req, resp);
                    break;
            }
        } catch(Exception e){
            e.printStackTrace();
        }
        if(!NewServer.RUNNING_FROM_JAR) addSameSiteCookieAttribute(resp);
    }
    

    public String leTodasLinhas(BufferedReader in) {
        StringBuilder saida = new StringBuilder();
        String line;
        try {
            while ((line = in.readLine()) != null) {
                saida.append(line);
            }
        } catch (Exception e) {
        }
        return saida.toString();
    }
    
    private void addSameSiteCookieAttribute(HttpServletResponse response) {
        Collection<String> headers = response.getHeaders("Set-Cookie");
        boolean firstHeader = true;
        for (String header : headers) { // there can be multiple Set-Cookie attributes
            if (firstHeader) {
                response.setHeader("Set-Cookie", String.format("%s; %s", header, "SameSite=None"));
                firstHeader = false;
                continue;
            }
            response.addHeader("Set-Cookie", String.format("%s; %s", header, "SameSite=None"));
        }
    }
    
    private void supplyApi(String subPath, HttpServletRequest req, HttpServletResponse resp) throws IOException{
        HttpSession session = req.getSession(true);
        PrintWriter writer = resp.getWriter();
        if(!subPath.endsWith("/"))subPath += "/";
        String resource = subPath.split("/")[0];
        System.out.println(resource);
        switch(resource){
            case "POST getProjects":
                List<Project> listaProjetos = CodegenDatabaseController.getListaProjetos();
                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                writer.println(gson.toJson(listaProjetos));
                break;
            case "POST getModels":
                System.out.println(req.getParameter("project"));
                List<String> listaModelosProjeto = CodegenDatabaseController.getListaModelosProjeto(req.getParameter("project"));
                writer.println(new Gson().toJson(listaModelosProjeto));
                break;
            case "POST novoModel":
                CodegenDatabaseController.addModel(retornaCookiePorNome(req.getCookies(), "project").getValue(),
                        ServerModel.fromJson(leTodasLinhas(req.getReader())));
                break;
            case "POST deleteModel":
                CodegenDatabaseController.deleteModel(retornaCookiePorNome(req.getCookies(), "project").getValue(),
                                                      req.getParameter("model"));
            case "POST getModel":
                String model = req.getParameter("model");
                String project = req.getParameter("project");
                writer.println(ServerModel.fromJson(
                        CodegenDatabaseController.getArquivoModelo(
                                retornaCookiePorNome(req.getCookies(), "project").getValue(), model
                        )).toJson());
                break;
            case "POST setModel":
                String linha = req.getReader().lines().findFirst().get();
                CodegenDatabaseController.gravaArquivoModelo(retornaCookiePorNome(req.getCookies(), "project").getValue(),
                        ServerModel.fromJson(linha));
                break;
            case "POST getProject":
                String proj = req.getParameter("project");
                writer.println(CodegenDatabaseController.getProjetoViaNome(proj).toJson());
                break;
            case "POST renameProject":
                String newName = new JSONObject(leTodasLinhas(req.getReader())).getString("newName");
                CodegenDatabaseController.renameProject(retornaCookiePorNome(req.getCookies(), "project").getValue(), newName);
                Cookie cookieProjeto = new Cookie("project", newName);
                cookieProjeto.setMaxAge(-1);
                cookieProjeto.setPath("/");
                resp.addCookie(cookieProjeto);
                break;
            case "POST chooseProjectFileJson":
                String fileEscolhaJson = new FileChooser().getFile("Codegen project file (.cgp)",false,"cgp");
                writer.println(new JSONObject().put("path",fileEscolhaJson).toString());
                break;
            case "POST chooseNewProjectFolderJson":
                String dirEscolhaJson = new FileChooser().getFile("New project path",true,"cgp");
                writer.println(new JSONObject().put("path", dirEscolhaJson).toString());
                break;
            case "POST importProject":
                CodegenDatabaseController.importaProjetoExistente(ProjectSpecs.fromJson(leTodasLinhas(req.getReader())).
                        getCaminho());
                break;
            case "POST createProject":
                CodegenDatabaseController.criaNovoProjeto(ProjectSpecs.fromJson(leTodasLinhas(req.getReader())));
                break;
            case "POST addTemplateProjeto":
                CodegenDatabaseController.newTemplate(TemplateSpecs.fromJson(leTodasLinhas(req.getReader())));
                break;
            case "POST addSnippetProjeto":
                CodegenDatabaseController.newSnippet(TemplateSpecs.fromJson(leTodasLinhas(req.getReader())));
                break;
            case "POST editaTemplateProjeto":
                CodegenDatabaseController.openTemplate(TemplateSpecs.fromJson(leTodasLinhas(req.getReader())));
                break;
            case "POST excluiTemplateProjeto":
                CodegenDatabaseController.excluiTemplate(TemplateSpecs.fromJson(leTodasLinhas(req.getReader())));
                break;
            case "POST unvincProject":
                String projToUnvinc = req.getParameter("project");
                CodegenDatabaseController.desvinculaProjeto(projToUnvinc);
                break;
            case "POST editaSnippetProjeto":
                CodegenDatabaseController.openSnippet(TemplateSpecs.fromJson(leTodasLinhas(req.getReader())));
                break;
            case "POST excluiSnippetProjeto":
                CodegenDatabaseController.excluiSnippet(TemplateSpecs.fromJson(leTodasLinhas(req.getReader())));
                break;
                
            case "POST setProjetoAtual":
                setProjetoAtual(req, resp);
                break;
            case "POST processaTemplate":
                ProccessorCore proccessorCore = new ProccessorCore(ProccessSpecs.fromJson(leTodasLinhas(req.getReader())));
                String log = null;
                try {
                    log = proccessorCore.process().toJson();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                writer.println(log);
                break;
            case "POST cancelaProcessamento":
                ProccessorCore.cancel();
                break;
        }
    }
    
    private void setProjetoAtual(HttpServletRequest req, HttpServletResponse resp) throws IOException{
        Cookie cookieProjeto = new Cookie("project", req.getParameter("project"));
        cookieProjeto.setMaxAge(-1);
        cookieProjeto.setPath("/");
        resp.addCookie(cookieProjeto);
        resp.sendRedirect("/index.html");
        resp.getWriter().println("{}");
    }
    
    private static Cookie retornaCookiePorNome(Cookie[] cookies, String nome) {
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(nome)) {
                    return cookie;
                }
            }
        }
        return new Cookie(nome, "");
    }
    
    private void supplyStatic(String resource, HttpServletRequest request, HttpServletResponse response){
        if(!NewServer.RUNNING_FROM_JAR) resource = "frontend-build/" + resource;
        resource = "frontend-build/" + resource;
        try{
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.addHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
            OutputStream outStream;
            // if you want to use a relative path to context root:
            try (InputStream fileStream = NewServer.getResource(resource)) {
                if(fileStream == null) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    return;
                }
                // obtains ServletContext
                ServletContext context = getServletContext();
                // gets MIME type of the file
                String mimeType = context.getMimeType("a."+resource.substring(resource.lastIndexOf(".")));
                if (mimeType == null) {
                    // set to binary type if MIME mapping not found
                    mimeType = "application/octet-stream";
                }   // modifies response
                response.setContentType(mimeType);
                response.setHeader("Cache-Control", "public, max-age=31536000");
                // forces download
                String headerKey = "Content-Disposition";
                String headerValue = "inline";
                response.setHeader(headerKey, headerValue);
                // obtains response's output stream
                outStream = response.getOutputStream();
                byte[] buffer = new byte[4096];
                int bytesRead;
                int totalSize = 0;
                while ((bytesRead = fileStream.read(buffer)) != -1) {
                    totalSize += bytesRead;
                    outStream.write(buffer, 0, bytesRead);
                }
                response.setContentLength(totalSize);
            }
            outStream.close();
        } catch(Exception e){}
    }
}
